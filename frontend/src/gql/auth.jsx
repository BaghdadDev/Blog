import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation signUp($userInput: UserInput!) {
    signUp(userInput: $userInput) {
      _id
      username
      email
      firstName
      lastName
      token {
        accessToken
        expiresAccessToken
      }
    }
  }
`;

export const SIGN_IN = gql`
  mutation signIn($usernameOrEmail: String!, $password: String!) {
    signIn(usernameOrEmail: $usernameOrEmail, password: $password) {
      _id
      username
      email
      firstName
      lastName
      token {
        accessToken
        expiresAccessToken
      }
    }
  }
`;
