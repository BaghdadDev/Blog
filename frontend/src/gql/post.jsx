import { gql } from "@apollo/client";
import { CORE_POST_FIELDS, CORE_FILE_FIELDS } from "./fragments.jsx";

// QUERIES ----------------------------------------------------------------
export const GET_POSTS = gql`
  ${CORE_POST_FIELDS}
  query GetPosts {
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
  ${CORE_POST_FIELDS}
  mutation createPost($postInput: PostInput!) {
    createPost(postInput: $postInput) {
      ...CorePostFields
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
// export const CREATED_POST_SUB = gql`
//   ${CORE_POST_FIELDS}
//   subscription CreatedPost {
//     createdPost {
//       ...CorePostFields
//     }
//   }
// `;

export const CREATED_POST_SUB = gql`
  subscription CreatedPost {
    createdPost {
      _id
      title
      story
      picture {
        _id
        filename
        contentType
        data
      }
      user {
        _id
        firstName
        lastName
        email
        username
        photo {
          _id
          filename
          contentType
          data
        }
      }
      likes {
        _id
      }
      comments {
        _id
      }
    }
  }
`;

export const DELETED_POST_SUB = gql`
  subscription DeletedPost($idPost: ID!) {
    deletedPost(idPost: $idPost) {
      _id
    }
  }
`;

export const TOGGLED_LIKE_POST_SUB = gql`
  subscription ToggledLikePost($idPost: ID!) {
    toggledLikePost(idPost: $idPost) {
      _id
    }
  }
`;

export const UPDATED_POST_SUB = gql`
  ${CORE_POST_FIELDS}
  subscription UpdatedPost($idPost: ID!) {
    updatedPost(idPost: $idPost) {
      ...CorePostFields
    }
  }
`;
