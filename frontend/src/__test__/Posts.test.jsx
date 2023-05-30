import {
  findByPlaceholderText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { useSubscription } from "@apollo/client";

import PATH from "../utils/route-path.jsx";
import Posts from "../routes/posts.jsx";
import PostDetails from "../routes/postDetails.jsx";
import {
  mockedGetPostById,
  mockedGetPosts,
  mockedSubCreatedPost,
  mockedSubDeletedPost,
  mockedSubToggledLikePost,
  mockedSubUpdatedPost,
  mockedToggleLikePost,
} from "./mockedGraphQL/post.jsx";
import {
  mockedGetComments,
  mockedSubCreatedComment,
  mockedSubDeletedComment,
} from "./mockedGraphQL/comment.jsx";
import { UserProvider } from "../context/userContext.jsx";
import mockedUser from "./mockedData/mockedUser.jsx";
import mockedPosts from "./mockedData/Post/mockedPosts.jsx";
import apolloClient from "../config/apollo-client.jsx";
import { GET_POST_BY_ID } from "../gql/post.jsx";

const mockedRender = ({ mocks, routes, initialEntries, initialIndex }) => {
  const router = createMemoryRouter(routes, {
    initialEntries: initialEntries ? initialEntries : ["/"],
    initialIndex: initialIndex ? initialIndex : 0,
  });

  const confCache = new InMemoryCache();

  return (
    <UserProvider initialValue={mockedUser}>
      <MockedProvider mocks={mocks} cache={apolloClient.cache}>
        <RouterProvider router={router} />
      </MockedProvider>
    </UserProvider>
  );
};

// const updateQueryMock = vi.fn();
// const cacheMock = {
//   ...apolloClient.cache,
//   transformDocument: vi.fn(),
//   updateQuery: updateQueryMock,
// };

apolloClient.cache.updateQuery = vi.fn();

// // Replace the cache object with the mock
// apolloClient.cache = cacheMock;

describe("Posts", () => {
  // it("Should render without problems", async () => {
  //   const routes = [{ path: PATH.ROOT, element: <Posts /> }];
  //   render(
  //     mockedRender({
  //       routes: routes,
  //       initialEntries: ["/"],
  //       mocks: [mockedGetPosts],
  //     })
  //   );
  //   const posts = await screen.findAllByTestId(/post-test-*/i);
  //   expect(posts.length).toBe(2);
  // });

  // it("Navigate to post details", async () => {
  //   const routes = [
  //     { path: PATH.ROOT, element: <Posts /> },
  //     { path: PATH.POST_DETAILS, element: <PostDetails /> },
  //   ];
  //   render(
  //     mockedRender({
  //       routes: routes,
  //       initialEntries: ["/"],
  //       mocks: [mockedGetPosts, mockedGetPostById, mockedGetComments],
  //     })
  //   );
  //   const links = await screen.findAllByRole("link");
  //   expect(links.length).toBe(2);
  //   userEvent.click(links[0]);
  //   expect(
  //     await screen.findByPlaceholderText(/write your comment here !/i)
  //   ).toBeInTheDocument();
  // });

  it("Toggle Like Post", async () => {
    const routes = [
      { path: PATH.ROOT, element: <Posts /> },
      { path: PATH.POST_DETAILS, element: <PostDetails /> },
    ];
    const subscriptionDataMock = {
      data: { toggledLikePost: { _id: mockedUser._id } },
    };
    useSubscription.mockReturnValue(subscriptionDataMock);
    render(
      mockedRender({
        routes: routes,
        initialEntries: [
          PATH.ROOT,
          String(PATH.POST_DETAILS).split(":")[0] + mockedPosts[0]._id,
        ],
        initialIndex: 1,
        mocks: [mockedGetPostById, mockedGetComments, mockedToggleLikePost],
      })
    );
    expect(
      await screen.findByPlaceholderText(/write your comment here !/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/0 Likes/i)).toBeInTheDocument();
    const btn_toggleLikePost = screen.getByTestId(/button-toggleLikePost/i);
    expect(btn_toggleLikePost).toBeInTheDocument();
    await waitFor(() => userEvent.click(btn_toggleLikePost));

    await waitFor(() => expect(useSubscription).toHaveBeenCalled());

    await waitFor(() =>
      expect(apolloClient.cache.updateQuery).toHaveBeenCalledTimes(1)
    );
    expect(apolloClient.cache.updateQuery).toHaveBeenCalledWith(
      { query: GET_POST_BY_ID, variables: { idPost: mockedPosts[0]._id } },
      expect.any(Function) // Ensure that a function is provided as the second argument
    );

    // const { data } = useSubscription();
    // expect(data).toEqual(subscriptionDataMock.data);
    // await waitFor(() => {
    //   expect(screen.getByText(/1 Likes/i)).toBeInTheDocument();
    // });
  });

  // it("useSubscription should return response automatically", async () => {
  //   const routes = [{ path: PATH.ROOT, element: <Posts /> }];
  //   render(
  //     mockedRender({
  //       routes: routes,
  //       initialEntries: ["/"],
  //       mocks: [
  //         mockedGetPosts,
  //         mockedSubCreatedPost,
  //         mockedSubUpdatedPost,
  //         mockedSubDeletedPost,
  //         mockedSubToggledLikePost,
  //         mockedSubCreatedComment,
  //         mockedSubDeletedComment,
  //       ],
  //     })
  //   );
  //   const posts = await screen.findAllByText(/Brothers/i);
  //   expect(posts.length).toBe(1);
  // });
});
