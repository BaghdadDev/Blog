import { useSubscription } from "@apollo/client";

import apolloClient from "../../../config/apollo-client";
import { GET_POSTS, DELETED_POST_SUB } from "../../../gql/post";

export default function subDeletePost(idPost) {
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
  return undefined;
}
