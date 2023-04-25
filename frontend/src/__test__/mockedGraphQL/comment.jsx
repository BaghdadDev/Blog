import {
  CREATE_COMMENT,
  CREATED_COMMENT_SUB,
  DELETED_COMMENT_SUB,
  GET_COMMENTS,
  TOGGLED_LIKE_COMMENT_SUB,
  UPDATED_COMMENT_SUB,
} from "../../gql/comment.jsx";
import { mockedComments } from "../mockedData/mockedComments.jsx";
import mockedPosts from "../mockedData/Post/mockedPosts.jsx";
import mockedUser from "../mockedData/mockedUser.jsx";

// MOCKED QUERIES --------------------------------------------------------
export const mockedGetComments = {
  request: {
    query: GET_COMMENTS,
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  result: { data: { getComments: mockedComments } },
};

// MOCKED MUTATION --------------------------------------------------------
export const mockedCreateComment = {
  request: {
    query: CREATE_COMMENT,
    variables: {
      user: "6401e882f8231e3015e93054",
      post: "6421c6a966b1bb36d7d3879c",
      comment: "New Comment",
    },
  },
  result: { data: { createComment: { _id: "6408dc8f0c6094c4470a358b" } } },
};

// MOCKED SUBSCRIPTIONS -------------------------------------------------
export const mockedSubCreatedComment = {
  request: {
    query: CREATED_COMMENT_SUB,
    variables: { idPost: mockedPosts[0]._id },
  },
  result: { data: { createdComment: mockedComments[1] } },
};

export const mockedSubDeletedComment = {
  request: {
    query: DELETED_COMMENT_SUB,
    variables: { idComment: mockedComments[0]._id },
  },
  result: { data: { deletedComment: mockedComments[0]._id } },
};

export const mockedSubToggledLikeComment = {
  request: {
    query: TOGGLED_LIKE_COMMENT_SUB,
    variables: { idComment: mockedComments[0]._id },
  },
  result: { data: { toggledLikeComment: { _id: mockedUser._id } } },
};

export const mockedSubUpdatedComment = {
  request: {
    query: UPDATED_COMMENT_SUB,
    variables: { idComment: mockedComments[0]._id },
  },
  result: { data: { updatedComment: mockedComments[0] } },
};
