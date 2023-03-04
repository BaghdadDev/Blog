import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation createComment($commentInput: CommentInput!) {
    createComment(commentInput: $commentInput) {
      _id
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($idComment: ID!) {
    deleteComment(idComment: $idComment) {
      _id
    }
  }
`;
