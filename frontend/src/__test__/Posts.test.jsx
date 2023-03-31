import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { GET_POSTS } from "../gql/post.jsx";
import { mockedPosts } from "./mockedData/Post/mockedPost.jsx";
import Posts from "../routes/posts.jsx";
import Post from "../components/Post/Post.jsx";
import { GraphQLError } from "graphql/error/index.js";

const mockedData = [
  {
    request: { query: GET_POSTS },
    result: { data: { getPosts: mockedPosts } },
  },
];

const mockedNetworkError = [
  {
    request: { query: GET_POSTS },
    error: new Error("An error occurred"),
  },
];

const mockedGraphQLError = [
  {
    request: { query: GET_POSTS },
    result: {
      errors: [new GraphQLError("Something went wrong during Get Posts")],
    },
  },
];

describe("Posts Component", () => {
  it("Post Component should render without error", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Post post={mockedPosts[0]} />
      </MemoryRouter>
    );
    // Title loaded
    expect(screen.getByText(/Brothers/i)).toBeInTheDocument();
    // Photo loaded
    expect(screen.getByAltText(/picture-filename*/i)).toBeInTheDocument();
  });

  it("Should render posts list", async () => {
    render(
      <MockedProvider mocks={mockedData} addTypename={true}>
        <MemoryRouter initialEntries={["/"]}>
          <Posts />
        </MemoryRouter>
      </MockedProvider>
    );
    // Loading state
    expect(await screen.findByTestId(/loading-skeleton/i)).toBeInTheDocument();
    // Data loaded successfully
    expect(await screen.findByText(/brothers/i)).toBeInTheDocument();
    expect(await screen.findByText(/motivation/i)).toBeInTheDocument();
  });

  describe("Should show error UI", async () => {
    it("Network Error", async () => {
      render(
        <MockedProvider mocks={mockedNetworkError} addTypename={false}>
          <MemoryRouter initialEntries={["/"]}>
            <Posts />
          </MemoryRouter>
        </MockedProvider>
      );
      expect(await screen.findByText(/An error occurred/i)).toBeInTheDocument();
    });
    it("GraphQL Error", async () => {
      render(
        <MockedProvider mocks={mockedGraphQLError} addTypename={false}>
          <MemoryRouter initialEntries={["/"]}>
            <Posts />
          </MemoryRouter>
        </MockedProvider>
      );
      // expect(
      //   await screen.findByTestId(/loading-skeleton/i)
      // ).toBeInTheDocument();
      expect(
        await screen.findByText(/Something went wrong during Get Posts/i)
      ).toBeInTheDocument();
    });
  });
});
