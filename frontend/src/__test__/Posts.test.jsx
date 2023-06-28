import { render, screen } from "@testing-library/react";
import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import PATH from "../utils/route-path.jsx";
import Posts from "../routes/posts.jsx";
import PostDetails from "../routes/postDetails.jsx";
import NewPost from "../routes/newPost.jsx";
import Index from "../components/Layout/index.jsx";
import SignIn from "../routes/signIn.jsx";
import EditPost from "../routes/editPost.jsx";

import { mockedGetPostById, mockedGetPosts } from "./mockedGraphQL/post.jsx";
import { mockedGetComments } from "./mockedGraphQL/comment.jsx";
import { UserProvider } from "../context/userContext.jsx";
import mockedUser from "./mockedData/mockedUser.jsx";

const mockedRender = ({ mocks, routes, initialEntries, initialIndex }) => {
  const router = createMemoryRouter(routes, {
    initialEntries: initialEntries ? initialEntries : ["/"],
    initialIndex: initialIndex ? initialIndex : 0,
  });

  const confCache = new InMemoryCache();

  return (
    <UserProvider initialValue={mockedUser}>
      <MockedProvider mocks={mocks} cache={confCache}>
        <RouterProvider router={router} />
      </MockedProvider>
    </UserProvider>
  );
};

describe("Posts : All pages should render without any problem", () => {
  it("Home : Posts page", async () => {
    const routes = [
      {
        path: PATH.ROOT,
        element: <Index />,
        children: [
          { index: true, element: <Posts /> },
          { path: PATH.SIGN_IN, element: <SignIn /> },
        ],
      },
    ];
    render(
      mockedRender({
        routes: routes,
        initialEntries: ["/"],
        mocks: [mockedGetPosts],
      })
    );
    const posts = await screen.findAllByTestId(/post-test-*/i);
    expect(posts.length).toBe(2);
  });

  it("Navigate to => Post Details", async () => {
    const routes = [
      { path: PATH.ROOT, element: <Posts /> },
      { path: PATH.POST_DETAILS, element: <PostDetails /> },
    ];
    render(
      mockedRender({
        routes: routes,
        initialEntries: ["/"],
        mocks: [mockedGetPosts, mockedGetPostById, mockedGetComments],
      })
    );
    const links = await screen.findAllByRole("link");
    expect(links.length).toBe(2);
    userEvent.click(links[0]);
    expect(
      await screen.findByPlaceholderText(/write your comment here !/i)
    ).toBeInTheDocument();
  });

  it("Navigate to => New Post", async () => {
    const routes = [
      {
        path: PATH.ROOT,
        element: <Index />,
        children: [
          { index: true, element: <Posts /> },
          { path: PATH.NEW_POST, element: <NewPost /> },
          { path: PATH.SIGN_IN, element: <SignIn /> },
        ],
      },
    ];
    render(mockedRender({ routes: routes, mocks: [mockedGetPosts] }));
    const btn_writeNewPost = await screen.findByText(/Write a Post/i);
    userEvent.click(btn_writeNewPost);
    expect(await screen.findByText(/New Post/i)).toBeInTheDocument();
  });

  it("Navigate to => Update Post", async () => {
    const routes = [
      {
        path: PATH.ROOT,
        element: <Index />,
        children: [
          { index: true, element: <Posts /> },
          { path: PATH.SIGN_IN, element: <SignIn /> },
          { path: PATH.POST_DETAILS, element: <PostDetails /> },
          { path: PATH.EDIT_POST, element: <EditPost /> },
        ],
      },
    ];
    render(
      mockedRender({
        routes: routes,
        initialEntries: ["/"],
        mocks: [mockedGetPosts, mockedGetPostById, mockedGetComments],
      })
    );
    const links = await screen.findAllByTestId(/post-img-link-*/i);
    userEvent.click(links[0]);
    const btn_optionsPostDetails = await screen.findByTestId(
      "btn-optionsPostDetails"
    );
    userEvent.click(btn_optionsPostDetails);
    const btn_editPost = await screen.findByText(/Edit Post/i);
    userEvent.click(btn_editPost);
    expect(await screen.findByText(/Edit Post/i)).toBeInTheDocument();
  });
});
