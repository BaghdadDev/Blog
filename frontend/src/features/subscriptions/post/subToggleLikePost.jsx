import { useSubscription } from "@apollo/client";

import apolloClient from "../../../lib/apollo-client";
import {
  GET_POST_BY_ID,
  GET_POSTS,
  TOGGLED_LIKE_POST_SUB,
} from "../../../gql/post";

/*
 * subToggleLikePost
 *
 * @param {string} idPost - The ID post
 * @param {string} query - To choose which subscription should be used
 */

export default function subToggleLikePost(idPost, query) {
  if (query === "GET_POSTS")
    useSubscription(TOGGLED_LIKE_POST_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { toggledLikePost },
        },
      }) => {
        apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
          const idUserToggledLikePost = toggledLikePost._id;
          const indexPost = dataCache.getPosts.findIndex(
            ({ _id }) => _id === idPost
          );
          const copyLikes = Array.isArray(dataCache.getPosts[indexPost]?.likes)
            ? [...dataCache.getPosts[indexPost].likes]
            : [];
          if (
            dataCache.getPosts[indexPost]?.likes.find(
              (like) => like._id === idUserToggledLikePost
            )
          ) {
            copyLikes.splice(
              copyLikes.findIndex((like) => like._id === idUserToggledLikePost),
              1
            );
          } else {
            copyLikes.push({ __typename: "User", _id: idUserToggledLikePost });
          }
          let copyPosts = [...dataCache.getPosts];
          copyPosts[indexPost] = { ...copyPosts[indexPost], likes: copyLikes };
          return {
            getPosts: copyPosts,
          };
        });
      },
    });
  else
    useSubscription(TOGGLED_LIKE_POST_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { toggledLikePost },
        },
      }) => {
        apolloClient.cache.updateQuery(
          { query: GET_POST_BY_ID, variables: { idPost } },
          (dataCache) => {
            if (!dataCache) return;
            const idUserToggledLike = toggledLikePost._id;
            const copyLikes = Array.isArray(dataCache.getPostById?.likes)
              ? [...dataCache.getPostById.likes]
              : [];
            if (copyLikes.find(({ _id }) => _id === idUserToggledLike)) {
              copyLikes.splice(
                copyLikes.findIndex(({ _id }) => _id === idUserToggledLike),
                1
              );
            } else {
              copyLikes.push({ __typename: "User", _id: idUserToggledLike });
            }
            return {
              getPostById: {
                ...dataCache.getPostById,
                likes: copyLikes,
              },
            };
          }
        );
      },
    });
  return undefined;
}
