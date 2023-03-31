import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useMutation } from "@apollo/client";

import Avatar from "../Avatar.jsx";
import { useUserContext } from "../../context/userContext.jsx";
import OptionsComment from "./OptionsComment.jsx";
import {
  TOGGLE_LIKE_COMMENT,
  TOGGLED_LIKE_COMMENT_SUB,
  UPDATED_COMMENT_SUB,
} from "../../gql/comment.jsx";
import CommentInput from "./CommentInput.jsx";

function Comment({ comment, subscribeToGetComments }) {
  const { user } = useUserContext();

  const [readOnly, setReadOnly] = useState(true);

  const [toggleLikeComment, { loading: loadingToggleLikeComment }] =
    useMutation(TOGGLE_LIKE_COMMENT);

  async function handleToggleLikeComment() {
    try {
      await toggleLikeComment({ variables: { idComment: comment._id } });
    } catch (errorToggleLikeComment) {
      console.log(errorToggleLikeComment);
    }
  }

  function subToggledLikeComment() {
    subscribeToGetComments({
      document: TOGGLED_LIKE_COMMENT_SUB,
      variables: { idComment: comment._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { _id: idUserToggledLikeComment } =
          subscriptionData.data.toggledLikeComment;
        const indexComment = prev.getComments.findIndex(
          ({ _id }) => _id === comment._id
        );
        let copyLikes = Array.isArray(prev.getComments[indexComment].likes)
          ? [...prev.getComments[indexComment].likes]
          : [];
        const indexUserLiked = copyLikes.findIndex(
          (like) => like?._id === idUserToggledLikeComment
        );
        if (indexUserLiked !== -1) {
          copyLikes.splice(indexUserLiked, 1);
        } else {
          copyLikes.push({ __typename: "User", _id: idUserToggledLikeComment });
        }
        let copyComments = [...prev.getComments];
        copyComments[indexComment] = {
          ...prev.getComments[indexComment],
          likes: copyLikes,
        };
        return Object.assign({}, prev, {
          getComments: copyComments,
        });
      },
    });
  }

  useEffect(() => {
    subToggledLikeComment();
  }, []);

  return (
    <div
      className={
        "mb-2 flex w-full flex-col items-center justify-center rounded-lg bg-gray-200 p-1 shadow"
      }
    >
      <div className={"flex w-full items-center gap-x-2"}>
        <Avatar {...comment.user.photo} size={30} />
        <CommentInput
          idComment={comment._id}
          text={comment.comment}
          readyOnly={readOnly}
          setReadOnly={setReadOnly}
        />
        {readOnly ? (
          <>
            {comment.user._id === user._id ? (
              <OptionsComment
                idComment={comment._id}
                idPost={comment.post._id}
                setReadyOnly={setReadOnly}
              />
            ) : undefined}
            <div className={"flex items-center gap-x-1"}>
              <div
                className={
                  "rounded-full p-1 hover:cursor-pointer hover:bg-gray-100"
                }
                onClick={handleToggleLikeComment}
              >
                {comment.likes.findIndex(
                  ({ _id: userId }) => userId === user._id
                ) === -1 ? (
                  <AiOutlineHeart className={"h-4 w-4 text-red-800"} />
                ) : (
                  <AiFillHeart className={"h-4 w-4 text-red-800"} />
                )}
              </div>
              <span className={"text-xs md:text-sm"}>
                {comment.likes.length}
              </span>
            </div>
          </>
        ) : undefined}
      </div>
    </div>
  );
}

export default Comment;
