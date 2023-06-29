import { useSubscription } from "@apollo/client";

import { GET_COMMENTS, UPDATED_COMMENT_SUB } from "../../../gql/comment.jsx";
import apolloClient from "../../../lib/apollo-client.jsx";

export default function subUpdateComment(idComment, idPost) {
  useSubscription(UPDATED_COMMENT_SUB, {
    variables: { idComment },
    onData: ({
      data: {
        data: { updatedComment },
      },
    }) => {
      apolloClient.cache.updateQuery(
        { query: GET_COMMENTS, variables: { idPost } },
        (dataCache) => {
          const indexComment = dataCache.getComments.findIndex(
            (c) => c._id === updatedComment._id
          );
          let commentsCopy = [...dataCache.getComments];
          commentsCopy[indexComment] = updatedComment;
          return {
            getComments: commentsCopy,
          };
        }
      );
    },
  });
  return undefined;
}
