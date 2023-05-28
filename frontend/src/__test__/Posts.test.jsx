import { render, screen } from "@testing-library/react";
import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import PATH from "../utils/route-path.jsx";
import Posts from "../routes/posts.jsx";
import {
  mockedGetPosts,
  mockedSubCreatedPost,
  mockedSubDeletedPost,
  mockedSubToggledLikePost,
  mockedSubUpdatedPost,
} from "./mockedGraphQL/post.jsx";
import {
  mockedSubCreatedComment,
  mockedSubDeletedComment,
} from "./mockedGraphQL/comment.jsx";
import { UserProvider } from "../context/userContext.jsx";
import mockedUser from "./mockedData/mockedUser.jsx";

const mockedRender = ({ mocks, routes, initialEntries }) => {
  const router = createMemoryRouter(routes, {
    initialEntries: initialEntries,
    initialIndex: 0,
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

describe("Testing Posts", () => {
  it("useSubscription should return response automatically", async () => {
    const routes = [{ path: PATH.ROOT, element: <Posts /> }];
    render(
      mockedRender({
        routes: routes,
        initialEntries: ["/"],
        mocks: [
          mockedGetPosts,
          mockedSubCreatedPost,
          mockedSubUpdatedPost,
          mockedSubDeletedPost,
          mockedSubToggledLikePost,
          mockedSubCreatedComment,
          mockedSubDeletedComment,
        ],
      })
    );
    const posts = await screen.findAllByText(/Brothers/i);
    expect(posts.length).toBe(1);
  });
});
