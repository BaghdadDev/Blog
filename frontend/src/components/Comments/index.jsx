import React, { useEffect } from "react";
import { BiSend } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";

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

function IndexComments({ idPost }) {
  const {
    user: { _id: idUser, photo: photoUser },
  } = useUserContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const {
    subscribeToMore,
    data: dataGetComments,
    loading: loadingGetComments,
    error: errorGetComments,
  } = useQuery(GET_COMMENTS, { variables: { idPost: idPost } });

  const [createComment, { loading: loadingCreateComment }] =
    useMutation(CREATE_COMMENT);

  function handleSubscribeToCreatedComment() {
    subscribeToMore({
      document: CREATED_COMMENT_SUB,
      variables: { idPost: idPost },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const createdComment = subscriptionData.data.commentCreated;
        const copyPrev = prev?.getComments ? prev.getComments : [];
        return Object.assign({}, prev, {
          getComments: [createdComment, ...copyPrev],
        });
      },
    });
  }

  function handleSubscribeToDeletedComment() {
    subscribeToMore({
      document: DELETED_COMMENT_SUB,
      variables: { idPost: idPost },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const idDeletedComment = subscriptionData.data.deletedComment;
        const filteredComments = prev.getComments.filter(
          (comment) => comment._id !== idDeletedComment
        );
        return Object.assign({}, prev, {
          getComments: [...filteredComments],
        });
      },
    });
  }

  useEffect(() => {
    handleSubscribeToCreatedComment();
    handleSubscribeToDeletedComment();
  }, []);

  async function handleSubmitComment(data) {
    try {
      const commentInput = {
        user: idUser,
        post: idPost,
        comment: data.commentText,
      };
      await createComment({ variables: { commentInput: commentInput } });
      reset();
    } catch (errorSubmittingComment) {
      console.log(errorSubmittingComment);
    }
  }

  if (loadingGetComments) return <p>Loading Comments ...</p>;

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
    <div className={"w-full"}>
      <div
        className={
          "flex w-full items-center gap-x-2 rounded-lg bg-white bg-gray-200 p-2 text-sm"
        }
      >
        <Avatar {...photoUser} />
        <form
          className={"flex grow items-center"}
          onSubmit={handleSubmit(handleSubmitComment)}
        >
          <CustomInput
            name={"commentText"}
            errors={errors}
            register={register}
            placeholder={"Write your comment here !"}
            className={""}
          />
          <button type={"submit"} className={"hidden"}>
            <BiSend className={"h-6 w-6 text-blue-800"} />
          </button>
        </form>
      </div>
      <div className={"w-full"}>
        {comments?.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default IndexComments;
