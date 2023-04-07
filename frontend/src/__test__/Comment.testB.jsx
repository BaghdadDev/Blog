import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { UserProvider } from "../context/userContext.jsx";
import mockedUser from "./mockedData/mockedUser.jsx";
import PATH from "../utils/route-path.jsx";
import PostDetails from "../routes/postDetails.jsx";
import mockedPosts from "./mockedData/Post/mockedPosts.jsx";
import { mockedGetPostById } from "./mockedGraphQL/post.jsx";
import {
  mockedCreateComment,
  mockedGetComments,
  mockedSubCreatedComment,
} from "./mockedGraphQL/comment.jsx";
import userEvent from "@testing-library/user-event";
import { InMemoryCache } from "@apollo/client";

const mockedRender = (mocks) => {
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPostById: {
            read(existing, { args }) {
              const { idPost } = args;
              return existing || mockedPosts[0];
            },
          },
        },
      },
    },
  });

  return (
    <MockedProvider mocks={mocks} cache={cache}>
      <UserProvider initialValue={mockedUser}>
        <MemoryRouter
          initialEntries={[`/post/${mockedPosts[0]._id}`]}
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

describe("Comments", () => {
  it("Should render without problems", async () => {
    render(mockedRender([mockedGetPostById, mockedGetComments]));
    expect(
      screen.getByTestId(/loading-skeleton-post-details/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByTestId(/loading-skeleton-comments/i)
    ).toBeInTheDocument();
    expect(await screen.findByRole("textbox")).toBeInTheDocument();
  });
  it("Should render the created comment", async () => {
    render(
      mockedRender([
        mockedGetPostById,
        mockedGetComments,
        mockedCreateComment,
        mockedSubCreatedComment,
      ])
    );
    const user = userEvent.setup();
    const inputComment = await screen.findByPlaceholderText(
      /write your comment here !/i
    );
  });
});
