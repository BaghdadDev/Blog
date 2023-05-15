import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { InMemoryCache } from "@apollo/client";

import mockedUser from "./mockedData/mockedUser.jsx";
import PostDetails from "../routes/postDetails.jsx";
import { UserProvider } from "../context/userContext.jsx";
import PATH from "../utils/route-path.jsx";
import EditPost from "../routes/editPost.jsx";
import {
  mockedDeletePost,
  mockedGetPostById,
  mockedGetPosts,
  mockedPostDetailsGraphQLError,
  mockedPostDetailsNetworkError,
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
  mockedSubToggledLikeComment,
  mockedSubUpdatedComment,
} from "./mockedGraphQL/comment.jsx";
import Posts from "../routes/posts.jsx";
import mockedPosts from "./mockedData/Post/mockedPosts.jsx";
import { CREATE_POST } from "../gql/post";
import NewPost from "../routes/newPost.jsx";
import RootLayout from "../components/Layout/RootLayout.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import SignIn from "../routes/signIn.jsx";
import SignUp from "../routes/signUp.jsx";

// RENDER ----------------------------------------------------------
const mockedRender = ({ routes, mocks, cache, initialEntries }) => {
  const confRoutes = routes ?? [
    {
      path: PATH.ROOT,
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          errorElement: <ErrorPage />,
          children: [
            { index: true, element: <Posts /> },
            {
              path: PATH.POST_DETAILS,
              element: <PostDetails />,
            },
            {
              path: PATH.NEW_POST,
              element: <NewPost />,
            },
            {
              path: PATH.EDIT_POST,
              element: <EditPost />,
            },
          ],
        },
      ],
    },
  ];

  const router = createMemoryRouter(confRoutes, {
    initialEntries: initialEntries ?? [`/post/${mockedPosts[0]._id}`],
    initialIndex: 0,
  });

  const confCache = cache ?? new InMemoryCache({ addTypename: true });

  return (
    <MockedProvider mocks={mocks} cache={confCache}>
      <UserProvider initialValue={mockedUser}>
        <RouterProvider router={router} />
      </UserProvider>
    </MockedProvider>
  );
};

// TESTING -------------------------------------------------------------
describe("Posts Details", () => {
  describe("Should render without problem", () => {
    it("renders with a parameter from the URL", async () => {
      render(mockedRender({ mocks: [mockedGetPostById, mockedGetComments] }));
      // Loading state (Skeleton)
      expect(
        screen.getByTestId(/loading-skeleton-post-details/i)
      ).toBeInTheDocument();
      // Data results
      expect(await screen.findByText(/brothers/i)).toBeInTheDocument();
      expect(
        await screen.findByPlaceholderText(/write your comment here !/i)
      ).toBeInTheDocument();
    });

    describe("Should handle errors", () => {
      it("Network Error", async () => {
        render(mockedRender({ mocks: [mockedPostDetailsNetworkError] }));
        expect(
          await screen.findByText(/An error occurred/i)
        ).toBeInTheDocument();
      });

      it("GraphQL Error", async () => {
        render(mockedRender({ mocks: [mockedPostDetailsGraphQLError] }));
        expect(
          await screen.findByText(
            /Something went wrong during Resolve Get Post Details/i
          )
        ).toBeInTheDocument();
      });
    });
  });

  it("Navigate to Edit Post", async () => {
    render(mockedRender({ mocks: [mockedGetPostById, mockedGetComments] }));
    // const user = userEvent.setup();
    const btnOptionsPostDetails = await screen.findByTestId(
      /button-optionsPostDetails/i
    );
    userEvent.click(btnOptionsPostDetails);
    const linkEditPost = screen.getByText(/edit/i);
    userEvent.click(linkEditPost);
    expect(await screen.findByText(/save/i)).toBeInTheDocument();
  });

  it("Toggle like", async () => {
    render(
      mockedRender({
        mocks: [
          mockedGetPostById,
          mockedGetComments,
          mockedToggleLikePost,
          mockedSubToggledLikePost,
        ],
      })
    );
    // const user = userEvent.setup();
    // The id user is already in likes array in mocked post
    expect(await screen.findByText(/2 likes/i)).toBeInTheDocument();
    const btnToggleLikePost = await screen.findByTestId(
      /button-toggleLikePost/i
    );
    userEvent.click(btnToggleLikePost);
    // So the length of likes array should decrease by one
    expect(await screen.findByText(/1 likes/i)).toBeInTheDocument();
  });

  it("Create Post", async () => {
    render(
      mockedRender({
        mocks: [mockedGetPosts, mockedGetPostById, mockedGetComments],
        initialEntries: ["/"],
      })
    );
    // const user = userEvent.setup();
    expect(await screen.findByText(/Write a Post/i)).toBeInTheDocument();
  });

  it("Delete Post", async () => {
    const routes = [
      { path: PATH.ROOT, element: <Posts /> },
      {
        path: PATH.POST_DETAILS,
        element: <PostDetails />,
      },
    ];

    const mockedSubscriptions = [
      mockedSubCreatedPost,
      mockedSubDeletedPost,
      mockedSubToggledLikePost,
      mockedSubUpdatedPost,
      mockedSubCreatedComment,
      mockedSubDeletedComment,
      mockedSubToggledLikeComment,
      mockedSubUpdatedComment,
    ];

    render(
      mockedRender({
        routes: routes,
        initialEntries: [PATH.ROOT],
        mocks: [
          // Queries
          mockedGetPosts,
          mockedGetPostById,
          mockedGetComments,
          // Mutation
          mockedDeletePost,
          // Subscriptions
          // mockedSubCreatedPost,
          mockedSubDeletedPost,
          // mockedSubToggledLikePost,
          // mockedSubUpdatedPost,
          // mockedSubCreatedComment,
          // mockedSubDeletedComment,
          // mockedSubToggledLikeComment,
          // mockedSubUpdatedComment,
        ],
      })
    );
    const allLinkPost = await screen.findAllByRole("link");
    console.log(allLinkPost[0]);
    expect(allLinkPost.length).toBe(2);
    // userEvent.click(allLinkPost[0]);
    fireEvent.click(allLinkPost[0]);
    await waitFor(() => {
      expect(screen.getByText(/posts list/i)).toBeInTheDocument();
    });
  });
});
