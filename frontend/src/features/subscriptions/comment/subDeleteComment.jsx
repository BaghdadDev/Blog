import React from "react";
import { useSubscription } from "@apollo/client";
import { DELETED_COMMENT_SUB, GET_COMMENTS } from "../../../gql/comment.jsx";
import apolloClient from "../../../lib/apollo-client.jsx";
import { GET_POST_BY_ID, GET_POSTS } from "../../../gql/post.jsx";

/*
 * subDeleteComment
 *
 * @param {string} idPost - The ID post
 * @param {string} query - To choose which subscription should be used
 */

export default function subDeleteComment(idPost, query) {
  if (query === "GET_POSTS")
    useSubscription(DELETED_COMMENT_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { deletedComment },
        },
      }) => {
        apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
          const idDeletedComment = deletedComment._id;
          const indexPost = dataCache.getPosts.findIndex(
            ({ _id }) => _id === idPost
          );
          const copyComments = [...dataCache.getPosts[indexPost].comments];
          copyComments.splice(
            copyComments.findIndex(
              (comment) => comment._id === idDeletedComment
            ),
            1
          );
          let copyPosts = [...dataCache.getPosts];
          copyPosts[indexPost] = {
            ...dataCache.getPosts[indexPost],
            comments: copyComments,
          };
          return {
            getPosts: copyPosts,
          };
        });
      },
    });
  else
    useSubscription(DELETED_COMMENT_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { deletedComment },
        },
      }) => {
        const idDeletedComment = deletedComment._id;
        apolloClient.cache.updateQuery(
          { query: GET_COMMENTS, variables: { idPost } },
          (dataCache) => {
            const filteredComments = dataCache.getComments.filter(
              (comment) => comment._id !== idDeletedComment
            );
            return {
              getComments: filteredComments,
            };
          }
        );
        apolloClient.cache.updateQuery(
          { query: GET_POST_BY_ID, variables: { idPost } },
          (dataCache) => {
            const filteredComments = dataCache.getPostById.comments.filter(
              (comment) => comment._id !== idDeletedComment
            );
            return {
              getPostById: {
                ...dataCache.getPostById,
                comments: filteredComments,
              },
            };
          }
        );
      },
    });
  return undefined;
}
