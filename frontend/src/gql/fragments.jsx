import { gql } from "@apollo/client";

export const CORE_FILE_FIELDS = gql`
  fragment CoreFileFields on File {
    _id
    filename
    contentType
    data
  }
`;

export const CORE_USER_FIELDS = gql`
  ${CORE_FILE_FIELDS}
  fragment CoreUserFields on User {
    _id
    firstName
    lastName
    email
    username
    photo {
      ...CoreFileFields
    }
  }
`;

export const CORE_COMMENT_FIELDS = gql`
  ${CORE_USER_FIELDS}
  fragment CoreCommentFields on Comment {
    _id
    comment
    user {
      ...CoreUserFields
    }
    post {
      _id
    }

    likes {
      _id
    }
  }
`;

export const CORE_POST_FIELDS = gql`
  ${CORE_FILE_FIELDS}
  ${CORE_USER_FIELDS}
  fragment CorePostFields on Post {
    _id
    title
    story
    picture {
      ...CoreFileFields
    }
    user {
      ...CoreUserFields
    }
    likes {
      _id
    }
    comments {
      _id
    }
    updatedAt
  }
`;
