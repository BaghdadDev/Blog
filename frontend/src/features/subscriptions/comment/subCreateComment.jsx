import { useSubscription } from "@apollo/client";

import apolloClient from "../../../lib/apollo-client";
import { GET_POST_BY_ID, GET_POSTS } from "../../../gql/post";
import { CREATED_COMMENT_SUB, GET_COMMENTS } from "../../../gql/comment";

/*
 * subCreateComment
 *
 * @param {string} idPost - The ID post
 * @param {string} query - To choose which subscription should be used
 */

export default function subCreateComment(idPost, query) {
  if (query === "GET_POSTS")
    useSubscription(CREATED_COMMENT_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { createdComment },
        },
      }) => {
        apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
          const indexPost = dataCache.getPosts.findIndex(
            ({ _id }) => _id === createdComment.post._id
          );
          const copyComments = Array.isArray(
            dataCache.getPosts[indexPost]?.comments
          )
            ? [...dataCache.getPosts[indexPost].comments]
            : [];
          copyComments.push({
            __typename: "Comment",
            _id: createdComment._id,
          });
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
    useSubscription(CREATED_COMMENT_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { createdComment },
        },
      }) => {
        apolloClient.cache.updateQuery(
          { query: GET_COMMENTS, variables: { idPost } },
          (dataCache) => {
            const comments = Array.isArray(dataCache?.getComments)
              ? [createdComment, ...dataCache.getComments]
              : [createdComment];
            return {
              getComments: comments,
            };
          }
        );
        apolloClient.cache.updateQuery(
          { query: GET_POST_BY_ID, variables: { idPost } },
          (dataCache) => {
            const newComment = {
              __typename: createdComment.__typename,
              _id: createdComment._id,
            };
            const copyComments = Array.isArray(dataCache.getPostById?.comments)
              ? [newComment, ...dataCache.getPostById?.comments]
              : [newComment];
            const copyPost = {
              ...dataCache.getPostById,
              comments: copyComments,
            };
            return {
              getPostById: copyPost,
            };
          }
        );
      },
    });
  return undefined;
}
