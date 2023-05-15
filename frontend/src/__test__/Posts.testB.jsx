import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import mockedPosts from "./mockedData/Post/mockedPosts.jsx";
import Posts from "../routes/posts.jsx";
import Post from "../components/Post/Post.jsx";
import PostDetails from "../routes/postDetails.jsx";
import PATH from "../utils/route-path.jsx";
import mockedUser from "./mockedData/mockedUser.jsx";
import { UserProvider } from "../context/userContext";
import {
  mockedGetPostById,
  mockedGetPosts,
  mockedPostsGraphQLError,
  mockedPostsNetworkError,
} from "./mockedGraphQL/post.jsx";
import { mockedGetComments } from "./mockedGraphQL/comment.jsx";

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

  it("Render two mocked posts", async () => {
    render(
      <MockedProvider mocks={[mockedGetPosts]} addTypename={true}>
        <MemoryRouter initialEntries={["/"]}>
          <Posts />
        </MemoryRouter>
      </MockedProvider>
    );
    // Loading state
    expect(screen.getByTestId(/loading-skeleton/i)).toBeInTheDocument();
    // Data results
    expect(await screen.findByText(/brothers/i)).toBeInTheDocument();
    expect(await screen.findByText(/motivation/i)).toBeInTheDocument();
  });

  describe("Should show error UI", async () => {
    it("Network Error", async () => {
      render(
        <MockedProvider mocks={mockedPostsNetworkError} addTypename={true}>
          <MemoryRouter initialEntries={["/"]}>
            <Posts />
          </MemoryRouter>
        </MockedProvider>
      );
      expect(await screen.findByText(/An error occurred/i)).toBeInTheDocument();
    });
    it("GraphQL Error", async () => {
      render(
        <MockedProvider mocks={mockedPostsGraphQLError} addTypename={true}>
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

  it("Navigate to Post Details", async () => {
    // const user = userEvent.setup();
    render(
      <MockedProvider
        mocks={[mockedGetPosts, mockedGetPostById, mockedGetComments]}
        addTypename={false}
      >
        <UserProvider initialValue={mockedUser}>
          <MemoryRouter initialEntries={["/"]} initialIndex={0}>
            <Routes>
              <Route path={PATH.ROOT} element={<Posts />} />
              <Route path={PATH.POST_DETAILS} element={<PostDetails />} />
            </Routes>
          </MemoryRouter>
        </UserProvider>
      </MockedProvider>
    );
    const linkPostDetails = (await screen.findAllByRole("link"))[0];
    userEvent.click(linkPostDetails);
    expect(await screen.findByText(/brothers/i)).toBeInTheDocument();
    expect(await screen.findByText(/this is amazing/i)).toBeInTheDocument();
    expect(
      await screen.findByPlaceholderText(/write your comment here !/i)
    ).toBeInTheDocument();
  });
});
