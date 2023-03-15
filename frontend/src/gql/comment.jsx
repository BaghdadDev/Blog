import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($idPost: ID!) {
    getComments(idPost: $idPost) {
      _id
      comment
      post {
        _id
      }
      user {
        _id
        firstName
        lastName
        photo {
          filename
          contentType
          data
        }
      }
      likes
    }
  }
`;

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

export const CREATED_COMMENT_SUB = gql`
  subscription CreatedComment($idPost: ID!) {
    createdComment(idPost: $idPost) {
      _id
      comment
      post {
        _id
      }
      user {
        _id
        firstName
        lastName
        photo {
          _id
          filename
          contentType
          data
        }
      }
      likes
    }
  }
`;

export const DELETED_COMMENT_SUB = gql`
  subscription DeletedComment($idPost: ID!) {
    deletedComment(idPost: $idPost)
  }
`;

export const TOGGLED_LIKE_COMMENT_SUB = gql`
  subscription ToggledLikeComment($idComment: ID!) {
    toggledLikeComment(idComment: $idComment) {
      id
      idUser
    }
  }
`;

export const UPDATED_COMMENT_SUB = gql`
  subscription UpdatedComment($idComment: ID!) {
    updatedComment(idComment: $idComment) {
      _id
      comment
      post {
        _id
      }
      user {
        _id
        firstName
        lastName
        photo {
          filename
          contentType
          data
        }
      }
      likes
    }
  }
`;
