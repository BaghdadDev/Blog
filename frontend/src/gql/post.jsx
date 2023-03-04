import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation createPost($postInput: PostInput!) {
    createPost(postInput: $postInput) {
      _id
    }
  }
`;

export const GET_POSTS = gql`
  query getPosts {
    getPosts {
      _id
      title
      story
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
      picture {
        filename
        contentType
        data
      }
      nbrLikes
      nbrComments
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($idPost: ID!) {
    deletePost(idPost: $idPost) {
      _id
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query getPostById($idPost: ID!) {
    getPostById(idPost: $idPost) {
      _id
      title
      story
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
      picture {
        filename
        contentType
        data
      }
      likes {
        _id
        lastName
        firstName
        photo {
          _id
          filename
          contentType
          data
        }
      }
      comments {
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
        likes {
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
      }
    }
  }
`;

export const TOGGLE_LIKE_POST = gql`
  mutation toggleLikePost($idPost: ID!, $idUser: ID!) {
    toggleLikePost(idPost: $idPost, idUser: $idUser)
  }
`;
