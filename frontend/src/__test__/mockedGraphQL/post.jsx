import { GraphQLError } from "graphql/error/index.js";

import {
  DELETE_POST,
  DELETED_POST_SUB,
  GET_POST_BY_ID,
  GET_POSTS,
  TOGGLE_LIKE_POST,
  TOGGLED_LIKE_POST_SUB,
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
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
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
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  error: new Error("An error occurred"),
};
export const mockedPostDetailsGraphQLError = {
  request: {
    query: GET_POST_BY_ID,
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  result: {
    errors: [
      new GraphQLError("Something went wrong during Resolve Get Post Details"),
    ],
  },
};

// TOGGLE LIKE POST -------------------------------------------------
export const mockedToggleLikePost = {
  request: {
    query: TOGGLE_LIKE_POST,
    variables: { idPost: "6421c6a966b1bb36d7d3879c", idUser: mockedUser._id },
  },
  result: { data: { toggleLikePost: {} } },
};
// SUBSCRIPTION TOGGLED LIKE POST
export const mockedSubToggledLikePost = {
  request: {
    query: TOGGLED_LIKE_POST_SUB,
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  result: { data: { toggledLikePost: { _id: mockedUser._id } } },
};

// DELETE POST --------------------------------------------------
export const mockedDeletePost = {
  request: {
    query: DELETE_POST,
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  result: { data: { deletePost: {} } },
};
// SUBSCRIPTION DELETED POST
export const mockedSubDeletedPost = {
  request: {
    query: DELETED_POST_SUB,
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  result: { data: { deletedPost: "6421c6a966b1bb36d7d3879c" } },
};
