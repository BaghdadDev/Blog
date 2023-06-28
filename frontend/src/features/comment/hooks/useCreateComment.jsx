import React from "react";
import { useMutation } from "@apollo/client";

import { CREATE_COMMENT } from "../../../gql/comment.jsx";

function useCreateComment() {
  const [createCommentMutation, { loading: loadingCreateComment }] =
    useMutation(CREATE_COMMENT);

  async function createComment(idPost, text) {
    try {
      const commentInput = {
        post: idPost,
        comment: text,
      };
      await createCommentMutation({ variables: { commentInput } });
    } catch (errorSubmittingComment) {
      console.log(errorSubmittingComment);
    }
  }
  return { createComment, loadingCreateComment };
}

export default useCreateComment;
