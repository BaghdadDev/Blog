import Index from "../layout/index.jsx";
import { createBrowserRouter } from "react-router-dom";

import PATH from "../utils/route-path.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import PostDetails from "../routes/postDetails.jsx";
import Posts from "../routes/posts.jsx";
import SignIn from "../routes/signIn.jsx";
import SignUp from "../routes/signUp.jsx";
import NewPost from "../routes/newPost.jsx";
import EditPost from "../routes/editPost.jsx";

const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: <Index />,
    errorElement: <ErrorPage />,
    // loader: rootLoader,
    // action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Posts /> },
          {
            path: PATH.SIGN_IN,
            element: <SignIn />,
          },
          {
            path: PATH.SIGN_UP,
            element: <SignUp />,
          },
          {
            path: PATH.NEW_POST,
            element: <NewPost />,
          },
          {
            path: PATH.POST_DETAILS,
            element: <PostDetails />,
          },
          {
            path: PATH.EDIT_POST,
            element: <EditPost />,
            // loader: contactLoader,
            // action: contactAction,
          },
        ],
      },
    ],
  },
]);

export default router;
