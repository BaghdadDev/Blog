import { render, screen } from "@testing-library/react";
import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import PATH from "../utils/route-path.jsx";
import Posts from "../routes/posts.jsx";
import Index from "../layout/index.jsx";
import SignIn from "../routes/signIn.jsx";

import { mockedSignIn } from "./mockedGraphQL/auth.jsx";
import { mockedGetPosts } from "./mockedGraphQL/post.jsx";
import { UserProvider } from "../context/userContext.jsx";

const mockedRender = ({ mocks, routes, initialEntries, initialIndex }) => {
  const router = createMemoryRouter(routes, {
    initialEntries: initialEntries ? initialEntries : ["/"],
    initialIndex: initialIndex ? initialIndex : 0,
  });

  const confCache = new InMemoryCache();

  return (
    <UserProvider>
      <MockedProvider mocks={mocks} cache={confCache}>
        <RouterProvider router={router} />
      </MockedProvider>
    </UserProvider>
  );
};

describe("Authentication Process", () => {
  it("SignIn", async () => {
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
      mockedRender({ routes: routes, mocks: [mockedSignIn, mockedGetPosts] })
    );
    const input_usernameOrEmail =
      screen.getByPlaceholderText(/Username or Email/i);
    const input_password = screen.getByPlaceholderText(/Password/i);
    userEvent.type(input_usernameOrEmail, "baghdad@gmail.com");
    userEvent.type(input_password, "123456");
    const btn_signIn = screen.getByRole("button", { name: /sign in/i });
    userEvent.click(btn_signIn);
    expect(
      await screen.findByPlaceholderText(/search post*/i)
    ).toBeInTheDocument();
  });
  it("SignUp", async () => {});
});
