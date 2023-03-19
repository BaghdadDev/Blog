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
    deletePost(idPost: $idPost)
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
      nbrComments
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($idPost: ID!, $postInput: PostInput!) {
    updatePost(idPost: $idPost, postInput: $postInput) {
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
      nbrComments
    }
  }
`;

export const TOGGLE_LIKE_POST = gql`
  mutation toggleLikePost($idPost: ID!, $idUser: ID!) {
    toggleLikePost(idPost: $idPost, idUser: $idUser)
  }
`;

export const CREATED_POST_SUB = gql`
  subscription PostCreated {
    postCreated {
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

export const LIKED_POST_SUB = gql`
  subscription LikedPost($idPost: ID!) {
    likedPost(idPost: $idPost) {
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
`;

export const DISLIKED_POST_SUB = gql`
  subscription DislikedPost($idPost: ID!) {
    dislikedPost(idPost: $idPost)
  }
`;

export const DELETED_POST_SUB = gql`
  subscription DeletedPost {
    deletedPost
  }
`;
