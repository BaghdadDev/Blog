import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";

import Avatar from "../Avatar.jsx";
import { useUserContext } from "../../context/userContext.jsx";
import OptionsComment from "./OptionsComment.jsx";

function Comment({ comment }) {
  const {
    user: { _id: idUser },
  } = useUserContext();

  return (
    <div className={"relative w-full"}>
      <div className={"absolute top-2 right-2"}>
        <OptionsComment idComment={comment._id} idPost={comment.post._id} />
      </div>
      <div className={"flex items-center gap-x-2"}>
        <Avatar {...comment.user.photo} />
        <p className={"grow"}>{comment.comment}</p>
      </div>
      <div className={"flex w-full items-center justify-center gap-x-2"}>
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
