import { useMutation } from "@apollo/client";
import { UPDATE_COMMENT } from "../../../gql/comment";

export default function useUpdateComment() {
  const [updateCommentMutation, { loading: loadingUpdateComment }] =
    useMutation(UPDATE_COMMENT);

  async function updateComment(idComment, text) {
    const commentInput = {
      comment: text,
    };
    try {
      await updateCommentMutation({
        variables: { idComment, commentInput: commentInput },
      });
    } catch (errorSubmittingUpdatedComment) {
      console.log(errorSubmittingUpdatedComment);
    }
  }

  return { updateComment, loadingUpdateComment };
}
