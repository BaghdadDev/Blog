import React, { useEffect } from "react";
import { BiSend } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import Avatar from "../Avatar.jsx";
import CustomInput from "../Custom/CustomInput.jsx";
import { useUserContext } from "../../context/userContext.jsx";
import {
  CREATE_COMMENT,
  CREATED_COMMENT_SUB,
  DELETED_COMMENT_SUB,
  GET_COMMENTS,
} from "../../gql/comment.jsx";
import Comment from "./Comment.jsx";
import ErrorGraphQL from "../ErrorGraphQL";
import apolloClient from "../../config/apollo-client.jsx";
import SkeletonComments from "../Skeleton/SkeletonComments.jsx";

function IndexComments({ idPost }) {
  const userContext = useUserContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    data: dataGetComments,
    loading: loadingGetComments,
    error: errorGetComments,
  } = useQuery(GET_COMMENTS, { variables: { idPost: idPost } });

  const [createComment, { loading: loadingCreateComment }] =
    useMutation(CREATE_COMMENT);

  const { data: dataSubCreatedComment, error: errorSubCreatedComment } =
    useSubscription(CREATED_COMMENT_SUB, { variables: { idPost } });

  const { data: dataSubDeletedComment, error: errorSubDeletedComment } =
    useSubscription(DELETED_COMMENT_SUB, { variables: { idPost } });

  async function handleSubmitComment(data) {
    try {
      const commentInput = {
        user: userContext?.user?._id,
        post: idPost,
        comment: data.commentText,
      };
      await createComment({ variables: { commentInput: commentInput } });
      reset();
    } catch (errorSubmittingComment) {
      console.log(errorSubmittingComment);
    }
  }

  useEffect(() => {
    if (dataSubCreatedComment && !errorSubCreatedComment) {
      apolloClient.cache.updateQuery(
        { query: GET_COMMENTS, variables: { idPost } },
        (dataCache) => {
          const createdComment = dataSubCreatedComment.createdComment;
          const comments = Array.isArray(dataCache?.getComments)
            ? [createdComment, ...dataCache.getComments]
            : [createdComment];
          return {
            getComments: comments,
          };
        }
      );
    }
  }, [dataSubCreatedComment, errorSubCreatedComment]);

  useEffect(() => {
    if (dataSubDeletedComment && !errorSubDeletedComment) {
      apolloClient.cache.updateQuery(
        { query: GET_COMMENTS, variables: { idPost } },
        (dataCache) => {
          const idDeletedComment = dataSubDeletedComment.deletedComment;
          const filteredComments = dataCache.getComments.filter(
            (comment) => comment._id !== idDeletedComment
          );
          return {
            getComments: filteredComments,
          };
        }
      );
    }
  }, [dataSubDeletedComment, errorSubDeletedComment]);

  if (loadingGetComments)
    return (
      <div className={"w-ful flex items-center justify-center"}>
        <SkeletonComments />
      </div>
    );

  if (errorGetComments) {
    if (errorGetComments?.graphQLErrors[0]?.extensions?.code !== "NOT-FOUND") {
      return (
        <div className={"w-ful flex items-center justify-center"}>
          <ErrorGraphQL errorGraphQL={errorGetComments} />
        </div>
      );
    }
  }

  const comments = dataGetComments?.getComments;

  return (
    <div
      className={
        "mb-16 flex w-full flex-col items-center justify-center px-2 text-xs md:text-sm"
      }
    >
      {userContext ? (
        <div className={"mb-4 flex w-full items-center gap-x-2"}>
          <Avatar {...userContext.user?.photo} />
          <form
            className={
              "flex grow items-center rounded-lg bg-gray-100 shadow-lg"
            }
            onSubmit={handleSubmit(handleSubmitComment)}
          >
            <CustomInput
              name={"commentText"}
              errors={errors}
              register={register}
              placeholder={"Write your comment here !"}
              className={"!bg-transparent"}
            />
            <button type={"submit"} className={"hidden"}>
              <BiSend className={"h-6 w-6 text-blue-800"} />
            </button>
          </form>
        </div>
      ) : undefined}

      <div className={"w-3/4"}>
        {comments?.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default IndexComments;
