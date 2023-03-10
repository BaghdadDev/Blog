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
      likes {
        _id
        firstName
        lastName
        photo {
          filename
          contentType
          data
        }
      }
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
  subscription CommentCreated($idPost: ID!) {
    commentCreated(idPost: $idPost) {
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
      likes {
        _id
        firstName
        lastName
        photo {
          filename
          contentType
          data
        }
      }
    }
  }
`;

export const DELETED_COMMENT_SUB = gql`
  subscription DeletedComment($idPost: ID!) {
    deletedComment(idPost: $idPost)
  }
`;
