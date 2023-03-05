import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useMutation } from "@apollo/client";

import Avatar from "../Avatar.jsx";
import { useUserContext } from "../../context/userContext.jsx";
import OptionsComment from "./OptionsComment.jsx";
import { TOGGLE_LIKE_COMMENT } from "../../gql/comment.jsx";
import { GET_POST_BY_ID } from "../../gql/post.jsx";

function Comment({ comment }) {
  const {
    user: { _id: idUser },
  } = useUserContext();

  const [toggleLikeComment, { loading: loadingToggleLikeComment }] =
    useMutation(TOGGLE_LIKE_COMMENT, {
      refetchQueries: [
        { query: GET_POST_BY_ID, variables: { idPost: comment.post._id } },
      ],
    });

  async function handleToggleLikeComment() {
    try {
      await toggleLikeComment({ variables: { idComment: comment._id } });
    } catch (errorToggleLikeComment) {
      console.log(errorToggleLikeComment);
    }
  }

  return (
    <div className={"relative w-full"}>
      <div className={"absolute top-2 right-2"}>
        <OptionsComment idComment={comment._id} idPost={comment.post._id} />
      </div>
      <div className={"flex items-center gap-x-2"}>
        <Avatar {...comment.user.photo} />
        <p className={"grow"}>{comment.comment}</p>
      </div>
      <div
        className={
          "flex w-full items-center justify-center gap-x-2 hover:cursor-pointer"
        }
        onClick={handleToggleLikeComment}
      >
        {comment.likes.findIndex(({ _id }) => _id === idUser) === -1 ? (
          <AiOutlineHeart className={"h-4 w-4 text-red-800"} />
        ) : (
          <AiFillHeart className={"h-4 w-4 text-red-800"} />
        )}
        <span>{comment.likes.length}</span>
      </div>
    </div>
  );
}

export default Comment;
