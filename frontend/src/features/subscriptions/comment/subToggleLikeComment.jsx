import { useSubscription } from "@apollo/client";
import {
  GET_COMMENTS,
  TOGGLED_LIKE_COMMENT_SUB,
} from "../../../gql/comment.jsx";
import apolloClient from "../../../lib/apollo-client.jsx";

export default function subToggleLikeComment(idComment, idPost) {
  useSubscription(TOGGLED_LIKE_COMMENT_SUB, {
    variables: { idComment },
    onData: ({
      data: {
        data: { toggledLikeComment },
      },
    }) => {
      apolloClient.cache.updateQuery(
        { query: GET_COMMENTS, variables: { idPost } },
        (dataCache) => {
          const idUserToggledLikeComment = toggledLikeComment._id;
          const indexComment = dataCache.getComments.findIndex(
            ({ _id }) => _id === idComment
          );
          let copyLikes = Array.isArray(
            dataCache.getComments[indexComment]?.likes
          )
            ? [...dataCache.getComments[indexComment].likes]
            : [];
          const indexUserLiked = copyLikes.findIndex(
            (like) => like?._id === idUserToggledLikeComment
          );
          if (indexUserLiked !== -1) {
            copyLikes.splice(indexUserLiked, 1);
          } else {
            copyLikes.push({
              __typename: "User",
              _id: idUserToggledLikeComment,
            });
          }
          let copyComments = [...dataCache.getComments];
          copyComments[indexComment] = {
            ...dataCache.getComments[indexComment],
            likes: copyLikes,
          };
          return {
            getComments: copyComments,
          };
        }
      );
    },
  });
  return undefined;
}
