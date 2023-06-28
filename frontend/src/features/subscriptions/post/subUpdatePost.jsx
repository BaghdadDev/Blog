import { useSubscription } from "@apollo/client";

import apolloClient from "../../../lib/apollo-client";
import { GET_POST_BY_ID, GET_POSTS, UPDATED_POST_SUB } from "../../../gql/post";

/*
 * subUpdatePost
 *
 * @param {string} idPost - The ID post
 * @param {string} query - To choose which subscription should be used
 */

export default function subUpdatePost(idPost, query) {
  if (query === "GET_POSTS")
    useSubscription(UPDATED_POST_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { updatedPost },
        },
      }) => {
        apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
          let copyPosts = [...dataCache.getPosts];
          copyPosts[
            dataCache.getPosts.findIndex(({ _id }) => _id === updatedPost._id)
          ] = updatedPost;
          return {
            getPosts: copyPosts,
          };
        });
      },
    });
  else
    useSubscription(UPDATED_POST_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { updatedPost },
        },
      }) => {
        apolloClient.cache.updateQuery(
          { query: GET_POST_BY_ID, variables: { idPost } },
          () => ({
            getPostById: updatedPost,
          })
        );
      },
    });
  return undefined;
}
