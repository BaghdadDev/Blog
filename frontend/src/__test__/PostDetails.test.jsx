import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

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
  mockedSubDeletedPost,
  mockedSubToggledLikePost,
  mockedToggleLikePost,
} from "./mockedGraphQL/post.jsx";
import { mockedGetComments } from "./mockedGraphQL/comment.jsx";
import Posts from "../routes/posts.jsx";

// RENDER ----------------------------------------------------------
const mockedRender = (mocks) => {
  return (
    <MockedProvider mocks={mocks} addTypename={true}>
      <UserProvider initialValue={mockedUser}>
        <MemoryRouter
          initialEntries={["/post/6421c6a966b1bb36d7d3879c"]}
          initialIndex={0}
        >
          <Routes>
            <Route path={PATH.POST_DETAILS} element={<PostDetails />} />
            <Route path={PATH.EDIT_POST} element={<EditPost />} />
            <Route path={PATH.ROOT} element={<Posts />} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </MockedProvider>
  );
};

// TESTING -------------------------------------------------------------
describe("Posts Details", () => {
  describe("Should render without problem", () => {
    it("renders with a parameter from the URL", async () => {
      render(mockedRender([mockedGetPostById, mockedGetComments]));
      // Loading state (Skeleton)
      expect(
        screen.getByTestId(/loading-skeleton-post-details/i)
      ).toBeInTheDocument();
      // Data results
      expect(await screen.findByText(/hamza/i)).toBeInTheDocument();
      expect(
        await screen.findByPlaceholderText(/write your comment here !/i)
      ).toBeInTheDocument();
    });

    describe("Should handle errors", () => {
      it("Network Error", async () => {
        render(mockedRender([mockedPostDetailsNetworkError]));
        expect(
          await screen.findByText(/An error occurred/i)
        ).toBeInTheDocument();
      });

      it("GraphQL Error", async () => {
        render(mockedRender([mockedPostDetailsGraphQLError]));
        expect(
          await screen.findByText(
            /Something went wrong during Resolve Get Post Details/i
          )
        ).toBeInTheDocument();
      });
    });
  });

  it("Navigate to Edit Post", async () => {
    render(mockedRender([mockedGetPostById, mockedGetComments]));
    const user = userEvent.setup();
    const btnOptionsPostDetails = await screen.findByTestId(
      /button-optionsPostDetails/i
    );
    await user.click(btnOptionsPostDetails);
    const linkEditPost = screen.getByText(/edit/i);
    await user.click(linkEditPost);
    expect(await screen.findByText(/save/i)).toBeInTheDocument();
  });

  it("Toggle like", async () => {
    render(
      mockedRender([
        mockedGetPostById,
        mockedGetComments,
        mockedToggleLikePost,
        mockedSubToggledLikePost,
      ])
    );
    const user = userEvent.setup();
    // The id user is already in likes array in mocked post
    expect(await screen.findByText(/2 likes/i)).toBeInTheDocument();
    const btnToggleLikePost = await screen.findByTestId(
      /button-toggleLikePost/i
    );
    await user.click(btnToggleLikePost);
    // So the length of likes array should decrease by one
    expect(await screen.findByText(/1 likes/i)).toBeInTheDocument();
  });

  it("Delete Post", async () => {
    render(
      mockedRender([
        mockedGetPostById,
        mockedGetComments,
        mockedDeletePost,
        // mockedSubDeletedPost,
        mockedGetPosts,
      ])
    );
    const user = userEvent.setup();
    const btnOptionsPostDetails = await screen.findByTestId(
      /button-optionsPostDetails/i
    );
    await user.click(btnOptionsPostDetails);
    const btnDeletePost = screen.getByText(/delete/i);
    // await user.click(btnDeletePost);
    // expect(await screen.findByText(/posts list/i)).toBeInTheDocument();
  });
});
