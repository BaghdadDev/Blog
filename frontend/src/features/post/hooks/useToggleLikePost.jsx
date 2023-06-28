import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import { TOGGLE_LIKE_POST } from "../../../gql/post.jsx";
import { UserContext } from "../../../context/userContext.jsx";

export default function useToggleLikePost(post) {
  const userContext = useContext(UserContext);
  const [optimisticLike, setOptimisticLike] = useState(false);

  const [toggleLikePostMutation, { loading: loadingToggleLikePost }] =
    useMutation(TOGGLE_LIKE_POST);

  async function toggleLikePost() {
    setOptimisticLike((prev) => !prev);
    try {
      await toggleLikePostMutation({
        variables: { idPost: post._id, idUser: userContext?.user._id },
      });
    } catch (errorToggleLikePost) {
      setOptimisticLike((prev) => !prev);
      console.log(errorToggleLikePost);
    }
  }

  useEffect(() => {
    if (
      post?.likes.findIndex((like) => like?._id === userContext?.user._id) ===
      -1
    ) {
      setOptimisticLike(false);
    } else {
      setOptimisticLike(true);
    }
  }, [post]);

  return { toggleLikePost, loadingToggleLikePost, optimisticLike };
}
