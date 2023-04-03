import { GraphQLError } from "graphql/error/index.js";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { GET_POST_BY_ID } from "../gql/post.jsx";
import { mockedPosts } from "./mockedData/Post/mockedPost.jsx";
import mockedUser from "./mockedData/mockedUser.jsx";
import PostDetails from "../routes/postDetails.jsx";
import { UserProvider } from "../context/userContext.jsx";
import { GET_COMMENTS } from "../gql/comment.jsx";
import { mockedComment } from "./mockedData/mockedComment.jsx";
import PATH from "../utils/route-path.jsx";

const mockedGetPostById = {
  request: {
    query: GET_POST_BY_ID,
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  result: { data: { getPostById: mockedPosts[0] } },
};

const mockedGetComments = {
  request: {
    query: GET_COMMENTS,
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  result: { data: { getComments: mockedComment } },
};

const mockedNetworkError = {
  request: {
    query: GET_POST_BY_ID,
    variables: { idPost: "6421c6a966b1bb36d7d3879c" },
  },
  error: new Error("An error occurred"),
};

const mockedGraphQLError = {
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

const mockedRender = (mocks) => {
  const value = { user: mockedUser };
  return (
    <MockedProvider mocks={mocks} addTypename={true}>
      <UserProvider initialValue={value}>
        <MemoryRouter
          initialEntries={["/post/6421c6a966b1bb36d7d3879c"]}
          initialIndex={0}
        >
          <Routes>
            <Route path={PATH.POST_DETAILS} element={<PostDetails />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </MockedProvider>
  );
};

describe("Posts Details", () => {
  describe("Should render without problem", () => {
    it("renders with a parameter from the URL", async () => {
      render(mockedRender([mockedGetPostById, mockedGetComments]));
      expect(await screen.findByText(/hamza/i)).toBeInTheDocument();
      expect(
        await screen.findByPlaceholderText(/write your comment here !/i)
      ).toBeInTheDocument();
    });

    describe("Should handle errors", () => {
      it("Network Error", async () => {
        render(mockedRender([mockedNetworkError]));
        expect(
          await screen.findByText(/An error occurred/i)
        ).toBeInTheDocument();
      });
      it("GraphQL Error", async () => {
        render(mockedRender([mockedGraphQLError]));
        expect(
          await screen.findByText(
            /Something went wrong during Resolve Get Post Details/i
          )
        ).toBeInTheDocument();
      });
    });
  });
});
