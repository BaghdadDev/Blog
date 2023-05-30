import { GraphQLError } from "graphql/error/index.js";

import {
  CREATED_POST_SUB,
  DELETE_POST,
  DELETED_POST_SUB,
  GET_POST_BY_ID,
  GET_POSTS,
  TOGGLE_LIKE_POST,
  TOGGLED_LIKE_POST_SUB,
  UPDATED_POST_SUB,
} from "../../gql/post.jsx";
import mockedPosts from "../mockedData/Post/mockedPosts.jsx";
import mockedUser from "../mockedData/mockedUser.jsx";

// GET POSTS LIST -------------------------------------------
export const mockedGetPosts = {
  request: { query: GET_POSTS },
  result: { data: { getPosts: mockedPosts } },
};

// GET POST DETAILS BY ID ------------------------------------
export const mockedGetPostById = {
  request: {
    query: GET_POST_BY_ID,
    variables: { idPost: mockedPosts[0]._id },
  },
  result: { data: { getPostById: mockedPosts[0] } },
};

// ERRORS : POSTS LIST --------------------------------------------
export const mockedPostsNetworkError = [
  {
    request: { query: GET_POSTS },
    error: new Error("An error occurred"),
  },
];
export const mockedPostsGraphQLError = [
  {
    request: { query: GET_POSTS },
    result: {
      errors: [new GraphQLError("Something went wrong during Get Posts")],
    },
  },
];

// ERRORS : POST DETAILS -------------------------------------------------
export const mockedPostDetailsNetworkError = {
  request: {
    query: GET_POST_BY_ID,
    variables: { idPost: mockedPosts[0]._id },
  },
  error: new Error("An error occurred"),
};
export const mockedPostDetailsGraphQLError = {
  request: {
    query: GET_POST_BY_ID,
    variables: { idPost: mockedPosts[0]._id },
  },
  result: {
    errors: [
      new GraphQLError("Something went wrong during Resolve Get Post Details"),
    ],
  },
};

// MUTATIONS ------------------------------------------------------
export const mockedToggleLikePost = {
  request: {
    query: TOGGLE_LIKE_POST,
    variables: { idPost: mockedPosts[0]._id, idUser: mockedUser._id },
  },
  result: { data: { toggleLikePost: true } },
};

export const mockedDeletePost = {
  request: {
    query: DELETE_POST,
    variables: { idPost: mockedPosts[0]._id },
  },
  result: { data: { deletePost: {} } },
};

// SUBSCRIPTIONS ---------------------------------------------
export const mockedSubCreatedPost = {
  request: {
    query: CREATED_POST_SUB,
    variables: {},
  },
  result: { data: { createdPost: mockedPosts[0] } },
};

export const mockedSubDeletedPost = {
  request: {
    query: DELETED_POST_SUB,
    variables: { idPost: mockedPosts[0]._id },
  },
  result: { data: { deletedPost: { _id: mockedPosts[0]._id } } },
};

export const mockedSubToggledLikePost = {
  request: {
    query: TOGGLED_LIKE_POST_SUB,
    variables: { idPost: mockedPosts[0]._id },
  },
  result: { data: { toggledLikePost: { _id: mockedUser._id } } },
};

export const mockedSubUpdatedPost = {
  request: {
    query: UPDATED_POST_SUB,
    variables: { idPost: mockedPosts[0]._id },
  },
  result: { data: { updatedPost: mockedPosts[0] } },
};
