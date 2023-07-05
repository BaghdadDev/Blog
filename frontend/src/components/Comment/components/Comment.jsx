import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import Avatar from "../../Avatar.jsx";
import { useUserContext } from "../../../context/userContext.jsx";
import OptionsComment from "./OptionsComment.jsx";
import CommentInput from "./CommentInput.jsx";
import { useToggleLikeComment } from "../../../features/comment/index.jsx";
import {
  subToggleLikeComment,
  subUpdateComment,
} from "../../../features/subscriptions/index.jsx";

function Comment({ comment }) {
  const userContext = useUserContext();

  const [readOnly, setReadOnly] = useState(true);

  const {
    toggleLikeComment,
    loadingToggleLikeComment,
    optimisticToggleLikeComment,
  } = useToggleLikeComment(comment);

  subToggleLikeComment(comment._id, comment.post._id);
  subUpdateComment(comment._id, comment.post._id);

  return (
    <div
      className={`mb-4 flex w-full items-center gap-x-2 rounded-lg border border-slate-200 bg-slate-200 p-1 ${
        !readOnly ? "bg-slate-50" : ""
      }`}
    >
      <Avatar {...comment.user.photo} size={30} />
      <CommentInput
        idComment={comment._id}
        text={comment.comment}
        readyOnly={readOnly}
        setReadOnly={setReadOnly}
      />
      {readOnly ? (
        <div className={"flex flex-col items-end justify-between"}>
          <div className={"flex items-center gap-x-2"}>
            {comment.user._id === userContext?.user?._id ? (
              <OptionsComment
                idComment={comment._id}
                idPost={comment.post._id}
                setReadyOnly={setReadOnly}
              />
            ) : undefined}
            <div className={"flex items-center gap-x-1"}>
              <div
                className={`rounded-full p-1 hover:cursor-pointer hover:bg-gray-100 ${
                  loadingToggleLikeComment ? "pointer-events-none" : ""
                }`}
                onClick={toggleLikeComment}
              >
                {optimisticToggleLikeComment ? (
                  <AiFillHeart
                    className={"pointer-events-none h-4 w-4 text-red-800"}
                  />
                ) : (
                  <AiOutlineHeart
                    className={"pointer-events-none h-4 w-4 text-red-800"}
                  />
                )}
              </div>
              <span className={"text-xs md:text-sm"}>
                {comment.likes.length}
              </span>
            </div>
          </div>
          <p className={"text-xs italic text-slate-500"}>{comment.updatedAt}</p>
        </div>
      ) : undefined}
    </div>
  );
}

export default Comment;
