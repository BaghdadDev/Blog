import { gql } from "@apollo/client";
import { CORE_COMMENT_FIELDS } from "./fragments.jsx";

// QUERIES ----------------------------------------------------------------
export const GET_COMMENTS = gql`
  ${CORE_COMMENT_FIELDS}
  query GetComments($idPost: ID!) {
    getComments(idPost: $idPost) {
      ...CoreCommentFields
    }
  }
`;

// MUTATIONS ----------------------------------------------------------------
export const CREATE_COMMENT = gql`
  mutation createComment($commentInput: CommentInput!) {
    createComment(commentInput: $commentInput) {
      _id
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($idComment: ID!, $commentInput: CommentInput!) {
    updateComment(idComment: $idComment, commentInput: $commentInput) {
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

// SUBSCRIPTIONS ----------------------------------------------------
export const CREATED_COMMENT_SUB = gql`
  ${CORE_COMMENT_FIELDS}
  subscription CreatedComment($idPost: ID!) {
    createdComment(idPost: $idPost) {
      ...CoreCommentFields
    }
  }
`;

export const DELETED_COMMENT_SUB = gql`
  subscription DeletedComment($idPost: ID!) {
    deletedComment(idPost: $idPost){
      _id
    }
  }
`;

export const TOGGLED_LIKE_COMMENT_SUB = gql`
  subscription ToggledLikeComment($idComment: ID!) {
    toggledLikeComment(idComment: $idComment) {
      _id
    }
  }
`;

export const UPDATED_COMMENT_SUB = gql`
  ${CORE_COMMENT_FIELDS}
  subscription UpdatedComment($idComment: ID!) {
    updatedComment(idComment: $idComment) {
      ...CoreCommentFields
    }
  }
`;
