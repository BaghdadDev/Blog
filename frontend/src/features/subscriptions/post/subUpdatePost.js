import { useSubscription } from "@apollo/client";

import apolloClient from "../../../config/apollo-client";
import { GET_POSTS, UPDATED_POST_SUB } from "../../../gql/post";

export default function subUpdatePost(idPost) {
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
  return undefined;
}
