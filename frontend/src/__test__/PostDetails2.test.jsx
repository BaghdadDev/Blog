import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import PATH from "../utils/route-path.jsx";
import Posts from "../routes/posts.jsx";
import PostDetails from "../routes/postDetails.jsx";
import {
  mockedDeletePost,
  mockedGetPostById,
  mockedGetPosts,
  mockedSubCreatedPost,
  mockedSubDeletedPost,
} from "./mockedGraphQL/post.jsx";
import { mockedGetComments } from "./mockedGraphQL/comment.jsx";
import { UserProvider } from "../context/userContext.jsx";
import mockedUser from "./mockedData/mockedUser.jsx";

const mockedRender = ({ mocks, routes, initialEntries }) => {
  const router = createMemoryRouter(routes, {
    initialEntries: initialEntries,
    initialIndex: 0,
  });

  const confCache = new InMemoryCache({ addTypename: true });

  return (
    <UserProvider initialValue={mockedUser}>
      <MockedProvider mocks={mocks} cache={confCache}>
        <RouterProvider router={router} />
      </MockedProvider>
    </UserProvider>
  );
};

it("Delete Post", async () => {
  const routes = [
    { path: PATH.ROOT, element: <Posts /> },
    {
      path: PATH.POST_DETAILS,
      element: <PostDetails />,
    },
  ];

  render(
    mockedRender({
      routes: routes,
      initialEntries: ["/"],
      mocks: [
        mockedGetPosts,
        mockedGetPostById,
        // mockedGetComments,
        mockedSubCreatedPost,
        mockedDeletePost,
        mockedSubDeletedPost,
      ],
    })
  );
  let allLinkPost = await screen.findAllByRole("link");
  expect(allLinkPost.length).toBe(2);
  userEvent.click(allLinkPost[0]);
  // expect(
  //   await screen.findByText(/This is the post details page/i)
  // ).toBeInTheDocument();
  expect(await screen.findByText(/Brothers/i)).toBeInTheDocument();
  // const btn_options = screen.getByTestId(/button-optionsPostDetails/i);
  // userEvent.click(btn_options);
  // const btn_delete = screen.getByText(/Delete Post/i);
  // expect(btn_delete).toBeInTheDocument();
  // userEvent.click(btn_delete);
  // expect(await screen.findByText(/posts list/)).toBeInTheDocument();
  // expect(screen.getByText(/Enemies/i)).toBeInTheDocument();
  // expect(screen.getByText(/Brothers/i)).toBeInTheDocument();
  // expect(screen.queryByText(/Brothers/i)).toBe(null);
  // allLinkPost = await screen.findAllByRole("link");
  // expect(allLinkPost.length).toBe(1);
});
