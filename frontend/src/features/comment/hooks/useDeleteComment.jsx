import { useMutation } from "@apollo/client";
import { DELETE_COMMENT } from "../../../gql/comment";

export default function useDeleteComment() {
  const [deleteCommentMutation, { loading: loadingDeleteComment }] =
    useMutation(DELETE_COMMENT);

  async function deleteComment(idComment) {
    try {
      await deleteCommentMutation({
        variables: { idComment },
      });
    } catch (errorDeleteComment) {
      console.log(errorDeleteComment);
    }
  }

  return { deleteComment, loadingDeleteComment };
}
