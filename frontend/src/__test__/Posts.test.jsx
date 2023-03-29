import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, BrowserRouter } from "react-router-dom";

import { GET_POSTS } from "../gql/post.jsx";
import { mockedPosts } from "./mockedData/mockedPost.jsx";
import Posts from "../routes/posts.jsx";
import Post from "../components/Post/Post.jsx";

const mocks = [
  {
    request: { query: GET_POSTS },
    result: { data: { getPosts: [...mockedPosts] } },
  },
];

describe("Posts Component", () => {
  // it("Post Component should render without error", () => {
  // render(
  //   <BrowserRouter>
  //     <Post post={mockedPosts[0]} />
  //   </BrowserRouter>
  // );
  //   const title = screen.getByText(/Brothers/i);
  //   const altImg = screen.getAllByAltText(/filename*/i);
  //   expect(title).toBeInTheDocument();
  //   expect(altImg.length).toBe(2);
  // });

  it("Posts Component should render without error", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={["/"]}>
          <Posts />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      screen.debug();
      expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
    });

    // const title = getByText(/brothers/i);
    // expect(title).toBeInTheDocument();
    // await waitFor(() => {
    //   const title = screen.getByText(/brother/i);
    //   expect(title).toBeInTheDocument();
    // });
  });
});
