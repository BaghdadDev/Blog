import { GET_COMMENTS } from "../../gql/comment.jsx";
import { mockedComment } from "../mockedData/mockedComment.jsx";

export const mockedGetComments = {
  request: {
    query: GET_COMMENTS,
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  result: { data: { getComments: mockedComment } },
};
