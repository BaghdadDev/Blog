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

function Comment({ comment, subscribeToMore }) {
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

  function handleSubscribeToggledLikeComment() {
    subscribeToMore({
      document: TOGGLED_LIKE_COMMENT_SUB,
      variables: { idComment: comment._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { idUser: idUserToggled, id: idComment } =
          subscriptionData.data.toggledLikeComment;
        console.log(idUserToggled);
        console.log(idComment);
        const indexComment = prev.getComments.findIndex(
          (c) => c._id === idComment
        );
        let likesCopy;
        if (prev.getComments[indexComment].likes.includes(idUserToggled)) {
          likesCopy = prev.getComments[indexComment].likes.filter(
            (idUserLike) => idUserLike !== idUserToggled
          );
        } else {
          likesCopy = [...prev.getComments[indexComment].likes, idUserToggled];
        }
        let commentsCopy = [...prev.getComments];
        commentsCopy[indexComment] = {
          ...prev.getComments[indexComment],
          likes: likesCopy,
        };
        return Object.assign({}, prev, {
          getComments: [...commentsCopy],
        });
      },
    });
  }

  function handleSubscribeUpdatedComment() {
    subscribeToMore({
      document: UPDATED_COMMENT_SUB,
      variables: { idComment: comment._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedComment = subscriptionData.data.updatedComment;
        const indexComment = prev.getComments.findIndex(
          (c) => c._id === updatedComment._id
        );
        let commentsCopy = [...prev.getComments];
        commentsCopy[indexComment] = { ...updatedComment };
        return Object.assign({}, prev, {
          getComments: [...commentsCopy],
        });
      },
    });
  }

  useEffect(() => {
    handleSubscribeToggledLikeComment();
    handleSubscribeUpdatedComment();
  }, []);

  return (
    <div
      className={"relative flex w-full flex-col items-center justify-center"}
    >
      <div className={"flex w-full items-center gap-x-2"}>
        <Avatar {...comment.user.photo} />
        <CommentInput
          idComment={comment._id}
          text={comment.comment}
          readyOnly={readOnly}
          setReadOnly={setReadOnly}
        />
        {readOnly ? (
          <OptionsComment
            idComment={comment._id}
            idPost={comment.post._id}
            setReadyOnly={setReadOnly}
          />
        ) : undefined}
      </div>
      {readOnly ? (
        <div className={"flex items-center gap-x-1"}>
          <div
            className={"rounded-lg p-1 hover:cursor-pointer hover:bg-gray-100"}
            onClick={handleToggleLikeComment}
          >
            {comment.likes.findIndex((userId) => userId === user._id) === -1 ? (
              <AiOutlineHeart className={"h-4 w-4 text-red-800"} />
            ) : (
              <AiFillHeart className={"h-4 w-4 text-red-800"} />
            )}
          </div>
          <span className={"text-xs md:text-sm"}>{comment.likes.length}</span>
        </div>
      ) : undefined}
    </div>
  );
}

export default Comment;
