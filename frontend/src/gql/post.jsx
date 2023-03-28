import { gql } from "@apollo/client";
import { CORE_POST_FIELDS, CORE_FILE_FIELDS } from "./fragments.jsx";

// QUERIES ----------------------------------------------------------------
export const GET_POSTS = gql`
  ${CORE_POST_FIELDS}
  query getPosts {
    getPosts {
      ...CorePostFields
    }
  }
`;

export const GET_POST_BY_ID = gql`
  ${CORE_POST_FIELDS}
  query getPostById($idPost: ID!) {
    getPostById(idPost: $idPost) {
      ...CorePostFields
    }
  }
`;

// MUTATIONS ----------------------------------------------------
export const CREATE_POST = gql`
  mutation createPost($postInput: PostInput!) {
    createPost(postInput: $postInput) {
      _id
    }
  }
`;
export const DELETE_POST = gql`
  mutation deletePost($idPost: ID!) {
    deletePost(idPost: $idPost)
  }
`;
export const UPDATE_POST_TEXT = gql`
  ${CORE_POST_FIELDS}
  mutation UpdatePostText($idPost: ID!, $postInput: PostInput!) {
    updatePostText(idPost: $idPost, postInput: $postInput) {
      ...CorePostFields
    }
  }
`;
export const UPDATE_POST_PICTURE = gql`
  ${CORE_FILE_FIELDS}
  mutation UpdatePostPicture($idPost: ID!, $picture: Upload!) {
    updatePostPicture(idPost: $idPost, picture: $picture) {
      ...CoreFileFields
    }
  }
`;

export const TOGGLE_LIKE_POST = gql`
  mutation toggleLikePost($idPost: ID!, $idUser: ID!) {
    toggleLikePost(idPost: $idPost, idUser: $idUser)
  }
`;

export const SEARCH_POSTS = gql`
  ${CORE_POST_FIELDS}
  mutation SearchPosts($search: String!) {
    searchPosts(search: $search) {
      ...CorePostFields
    }
  }
`;

// SUBSCRIPTIONS --------------------------------------------------------------
export const CREATED_POST_SUB = gql`
  ${CORE_POST_FIELDS}
  subscription CreatedPost {
    createdPost {
      ...CorePostFields
    }
  }
`;

export const DELETED_POST_SUB = gql`
  subscription DeletedPost {
    deletedPost
  }
`;

export const DELETED_POST_DETAILS_SUB = gql`
  subscription DeletedPostDetails($idPost: ID!) {
    deletedPostDetails(idPost: $idPost)
  }
`;

export const UPDATED_POST_TEXT_SUB = gql`
  ${CORE_POST_FIELDS}
  subscription UpdatedPostText($idPost: ID!) {
    updatedPostText(idPost: $idPost) {
      ...CorePostFields
    }
  }
`;

export const UPDATED_POST_PICTURE_SUB = gql`
  ${CORE_FILE_FIELDS}
  subscription UpdatedPostPicture($idPost: ID!) {
    updatedPostPicture(idPost: $idPost) {
      ...CoreFileFields
    }
  }
`;

export const UPDATED_POST_SUB = gql`
  ${CORE_POST_FIELDS}
  subscription UpdatedPost {
    updatedPost {
      ...CorePostFields
    }
  }
`;

export const TOGGLED_LIKE_POST_DETAILS_SUB = gql`
  subscription ToggledLikePostDetails($idPost: ID!) {
    toggledLikePostDetails(idPost: $idPost) {
      _id
    }
  }
`;

export const TOGGLED_LIKE_POST_SUB = gql`
  subscription ToggledLikePost {
    toggledLikePost {
      _id
      user {
        _id
      }
    }
  }
`;
