import { SIGN_IN } from "../../gql/auth.jsx";
import mockedUser from "../mockedData/mockedUser.jsx";

export const mockedSignIn = {
  request: {
    query: SIGN_IN,
    variables: { usernameOrEmail: "baghdad@gmail.com", password: "123456" },
  },
  result: {
    data: {
      signIn: {
        ...mockedUser,
        token: {
          accessToken: "abcdefghijklmnopqrstuvwxyz",
          expiresAccessToken: Date.now() * 2,
        },
      },
    },
  },
};
