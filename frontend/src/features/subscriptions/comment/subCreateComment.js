import { useSubscription } from "@apollo/client";

import apolloClient from "../../../config/apollo-client";
import { GET_POSTS } from "../../../gql/post";
import { CREATED_COMMENT_SUB } from "../../../gql/comment";

export default function subCreateComment(idPost) {
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
  return undefined;
}
