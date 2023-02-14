import RoutLayout from "../components/Layout/RootLayout.jsx";
import { createBrowserRouter } from "react-router-dom";

import PATH from "../utils/route-path.jsx";
import ErrorPage from "../components/ErrorPage.jsx";
import PostDetails from "../routes/postDetails.jsx";
import EditPost from "../routes/editPost.jsx";
import Posts from "../routes/posts.jsx";
import SignIn from "../routes/signIn.jsx";
import SignUp from "../routes/signUp.jsx";

const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: <RoutLayout />,
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
            path: PATH.POST_DETAILS,
            element: <PostDetails />,
            // loader: contactLoader,
            // action: contactAction,
          },
          {
            path: PATH.EDIT_POST,
            element: <EditPost />,
            // loader: contactLoader,
            // action: editAction,
          },
          {
            path: PATH.PROFILE,
            element: <EditPost />,
            // loader: contactLoader,
            // action: editAction,
          },
        ],
      },
    ],
  },
]);

export default router;
