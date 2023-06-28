import React from "react";
import { useMutation } from "@apollo/client";
import { DELETE_POST } from "../../../gql/post.jsx";

export default function useDeletePost() {
  const [deletePostMutation, { loading: loadingDeletePost }] =
    useMutation(DELETE_POST);

  async function deletePost(idPost) {
    try {
      await deletePostMutation({ variables: { idPost } });
    } catch (errorDeletePost) {
      console.log(errorDeletePost);
    }
  }
  return { deletePost, loadingDeletePost };
}
