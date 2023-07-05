import { useSubscription } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import apolloClient from "../../../lib/apollo-client";
import { GET_POSTS, DELETED_POST_SUB, GET_POST_BY_ID } from "../../../gql/post";
import PATH from "../../../config/route-path.jsx";

/*
 * subDeletePost
 *
 * @param {string} idPost - The ID post
 * @param {string} query - To choose which subscription should be used
 */

export default function subDeletePost(idPost, query) {
  const navigate = useNavigate();

  if (query === "GET_POSTS")
    useSubscription(DELETED_POST_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { deletedPost },
        },
      }) => {
        apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
          const filteredPosts = dataCache.getPosts.filter(
            (post) => post._id !== deletedPost._id
          );
          return {
            getPosts: filteredPosts,
          };
        });
      },
    });
  else
    useSubscription(DELETED_POST_SUB, {
      variables: { idPost },
      onData: ({
        data: {
          data: { deletedPost },
        },
      }) => {
        apolloClient.cache.updateQuery(
          { query: GET_POST_BY_ID, variables: { idPost } },
          () => null
        );
        apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
          if (!dataCache) return;
          const posts = dataCache.getPosts.filter(
            (post) => post._id !== deletedPost._id
          );
          return { getPosts: posts };
        });
        navigate(PATH.ROOT);
      },
    });
  return undefined;
}
