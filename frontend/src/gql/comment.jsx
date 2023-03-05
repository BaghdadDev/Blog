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

export const TOGGLE_LIKE_COMMENT = gql`
  mutation toggleLikeComment($idComment: ID!) {
    toggleLikeComment(idComment: $idComment) {
      _id
    }
  }
`;
