import { createContext } from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

import { CREATED_POST_SUB, GET_POST_BY_ID, GET_POSTS } from "../gql/post.jsx";
import { mockedPosts } from "./mockedData/Post/mockedPost.jsx";
import Posts from "../routes/posts.jsx";
import Post from "../components/Post/Post.jsx";
import { GraphQLError } from "graphql/error/index.js";
import PostDetails from "../routes/postDetails.jsx";
import PATH from "../utils/route-path.jsx";
import mockedUser from "./mockedData/mockedUser.jsx";
import { GET_COMMENTS } from "../gql/comment.jsx";
import { mockedComment } from "./mockedData/mockedComment.jsx";
import { UserProvider } from "../context/userContext";

const MockedUserContext = createContext();

const mockedGetPosts = {
  request: { query: GET_POSTS },
  result: { data: { getPosts: mockedPosts } },
};

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

const mockedSubscription = {
  request: {
    query: CREATED_POST_SUB,
  },
  result: {
    data: {
      createdPost: mockedPosts[0],
    },
  },
};

describe("Posts Component", () => {
  it("Post Component should render without error", () => {
    const mockedSubscribeToGetPosts = vi.fn();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Post
          post={mockedPosts[0]}
          subscribeToGetPosts={mockedSubscribeToGetPosts}
        />
      </MemoryRouter>
    );
    // Title loaded
    expect(screen.getByText(/Brothers/i)).toBeInTheDocument();
    // Photo loaded
    expect(screen.getByAltText(/picture-filename*/i)).toBeInTheDocument();
  });

  it("Should render posts list", async () => {
    render(
      <MockedProvider mocks={[mockedGetPosts]} addTypename={true}>
        <MemoryRouter initialEntries={["/"]}>
          <Posts />
        </MemoryRouter>
      </MockedProvider>
    );
    // Loading state
    expect(screen.getByTestId(/loading-skeleton/i)).toBeInTheDocument();
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
        <MockedProvider mocks={mockedGraphQLError} addTypename={true}>
          <MemoryRouter initialEntries={["/"]}>
            <Posts />
          </MemoryRouter>
        </MockedProvider>
      );
      expect(screen.getByTestId(/loading-skeleton/i)).toBeInTheDocument();
      expect(
        await screen.findByText(/Something went wrong during Get Posts/i)
      ).toBeInTheDocument();
    });
  });

  it("Should navigate to Post Details page when click on the link", async () => {
    const value = { user: mockedUser };
    const user = userEvent.setup();

    render(
      <MockedProvider
        mocks={[mockedGetPosts, mockedGetPostById, mockedGetComments]}
        addTypename={true}
      >
        <UserProvider initialValue={value}>
          <BrowserRouter>
            <Routes>
              <Route path={PATH.ROOT} element={<Posts />} />
              <Route path={PATH.POST_DETAILS} element={<PostDetails />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </MockedProvider>
    );
    const linkPostDetails = (await screen.findAllByRole("link"))[0];
    await user.click(linkPostDetails);
    expect(await screen.findByText(/brothers/i)).toBeInTheDocument();
    expect(await screen.findByText(/this is amazing/i)).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText(/write your comment here !/i)
    ).toBeInTheDocument();
  });
});
