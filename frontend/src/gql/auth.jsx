import { gql } from "@apollo/client";
import { CORE_USER_FIELDS } from "./fragments.jsx";

export const SIGN_UP = gql`
  ${CORE_USER_FIELDS}
  mutation signUp($userInput: UserInput!) {
    signUp(userInput: $userInput) {
      ...CoreUserFields
      token {
        accessToken
        expiresAccessToken
      }
    }
  }
`;

export const SIGN_IN = gql`
  ${CORE_USER_FIELDS}
  mutation signIn($usernameOrEmail: String!, $password: String!) {
    signIn(usernameOrEmail: $usernameOrEmail, password: $password) {
      ...CoreUserFields
      token {
        accessToken
        expiresAccessToken
      }
    }
  }
`;
