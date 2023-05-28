import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useMutation, useSubscription } from "@apollo/client";

import Avatar from "../Avatar.jsx";
import { useUserContext } from "../../context/userContext.jsx";
import OptionsComment from "./OptionsComment.jsx";
import {
  GET_COMMENTS,
  TOGGLE_LIKE_COMMENT,
  TOGGLED_LIKE_COMMENT_SUB,
  UPDATED_COMMENT_SUB,
} from "../../gql/comment.jsx";
import CommentInput from "./CommentInput.jsx";
import apolloClient from "../../config/apollo-client.jsx";

function Comment({ comment }) {
  const userContext = useUserContext();

  const [readOnly, setReadOnly] = useState(true);

  const [optimisticToggleLikeComment, setOptimisticToggleLikeComment] =
    useState(
      () => !!comment?.likes.find(({ _id }) => _id === userContext?.user._id)
    );

  const [toggleLikeComment, { loading: loadingToggleLikeComment }] =
    useMutation(TOGGLE_LIKE_COMMENT);

  useSubscription(TOGGLED_LIKE_COMMENT_SUB, {
    variables: { idComment: comment._id },
    onData: ({
      data: {
        data: { toggledLikeComment },
      },
    }) => {
      apolloClient.cache.updateQuery(
        { query: GET_COMMENTS, variables: { idPost: comment.post._id } },
        (dataCache) => {
          const idUserToggledLikeComment = toggledLikeComment._id;
          const indexComment = dataCache.getComments.findIndex(
            ({ _id }) => _id === comment._id
          );
          let copyLikes = Array.isArray(
            dataCache.getComments[indexComment]?.likes
          )
            ? [...dataCache.getComments[indexComment].likes]
            : [];
          const indexUserLiked = copyLikes.findIndex(
            (like) => like?._id === idUserToggledLikeComment
          );
          if (indexUserLiked !== -1) {
            copyLikes.splice(indexUserLiked, 1);
          } else {
            copyLikes.push({
              __typename: "User",
              _id: idUserToggledLikeComment,
            });
          }
          let copyComments = [...dataCache.getComments];
          copyComments[indexComment] = {
            ...dataCache.getComments[indexComment],
            likes: copyLikes,
          };
          return {
            getComments: copyComments,
          };
        }
      );
    },
  });

  useSubscription(UPDATED_COMMENT_SUB, {
    variables: { idComment: comment._id },
    onData: ({
      data: {
        data: { updatedComment },
      },
    }) => {
      apolloClient.cache.updateQuery(
        { query: GET_COMMENTS, variables: { idPost: comment.post._id } },
        (dataCache) => {
          const indexComment = dataCache.getComments.findIndex(
            (c) => c._id === updatedComment._id
          );
          let commentsCopy = [...dataCache.getComments];
          commentsCopy[indexComment] = updatedComment;
          return {
            getComments: commentsCopy,
          };
        }
      );
    },
  });

  async function handleToggleLikeComment() {
    setOptimisticToggleLikeComment((prev) => !prev);
    try {
      await toggleLikeComment({ variables: { idComment: comment._id } });
    } catch (errorToggleLikeComment) {
      console.log(errorToggleLikeComment);
      setOptimisticToggleLikeComment((prev) => !prev);
    }
  }

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
            {comment.user._id === userContext?.user._id ? (
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
                onClick={handleToggleLikeComment}
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
          </>
        ) : undefined}
      </div>
    </div>
  );
}

export default Comment;
