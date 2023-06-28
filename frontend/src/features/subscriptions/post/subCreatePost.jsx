import { useSubscription } from "@apollo/client";

import apolloClient from "../../../lib/apollo-client";
import { GET_POSTS, CREATED_POST_SUB } from "../../../gql/post";

export default function subCreatePost() {
  useSubscription(CREATED_POST_SUB, {
    onData: ({
      data: {
        data: { createdPost },
      },
    }) => {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
        const posts = Array.isArray(dataCache?.getPosts)
          ? dataCache.getPosts
          : [];
        return {
          getPosts: [createdPost, ...posts],
        };
      });
    },
  });
  return undefined;
}
