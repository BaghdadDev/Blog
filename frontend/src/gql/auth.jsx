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
  mutation signIn($credentialsInput: CredentialsInput!) {
    signIn(credentialsInput: $credentialsInput) {
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
