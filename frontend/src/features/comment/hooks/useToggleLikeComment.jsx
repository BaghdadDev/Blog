import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { TOGGLE_LIKE_COMMENT } from "../../../gql/comment.jsx";
import { useUserContext } from "../../../context/userContext";

export default function useToggleLikeComment(comment) {
  const userContext = useUserContext();

  const [toggleLikeCommentMutation, { loading: loadingToggleLikeComment }] =
    useMutation(TOGGLE_LIKE_COMMENT);

  const [optimisticToggleLikeComment, setOptimisticToggleLikeComment] =
    useState(false);

  useEffect(() => {
    if (!comment) return undefined;
    setOptimisticToggleLikeComment(
      () => !!comment?.likes.find(({ _id }) => _id === userContext?.user?._id)
    );
  }, [comment]);

  async function toggleLikeComment() {
    setOptimisticToggleLikeComment((prev) => !prev);
    try {
      await toggleLikeCommentMutation({
        variables: { idComment: comment._id },
      });
    } catch (errorToggleLikeComment) {
      console.log(errorToggleLikeComment);
      setOptimisticToggleLikeComment((prev) => !prev);
    }
  }

  return {
    toggleLikeComment,
    loadingToggleLikeComment,
    optimisticToggleLikeComment,
  };
}
