import {
  CREATE_COMMENT,
  CREATED_COMMENT_SUB,
  GET_COMMENTS,
} from "../../gql/comment.jsx";
import { mockedComments } from "../mockedData/mockedComments.jsx";

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
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  result: { data: { createdComment: mockedComments[1] } },
};
