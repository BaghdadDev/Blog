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
  TOGGLED_LIKE_COMMENT_SUB,
  UPDATED_COMMENT_SUB,
} from "../../gql/comment.jsx";
import Comment from "./Comment.jsx";
import ErrorGraphQL from "../ErrorGraphQL";
import apolloClient from "../../config/apollo-client.jsx";
import { GET_POST_BY_ID } from "../../gql/post.jsx";

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
        const createdComment = subscriptionData.data.createdComment;
        apolloClient.cache.updateQuery(
          { query: GET_POST_BY_ID, variables: { idPost: idPost } },
          (dataCache) => {
            const prevComments = Array.isArray(dataCache?.getPostById?.comments)
              ? dataCache.getPostById.comments
              : [];
            return {
              getPostById: {
                ...dataCache.getPostById,
                comments: [
                  {
                    __typename: createdComment.__typename,
                    _id: createdComment._id,
                  },
                  ...prevComments,
                ],
              },
            };
          }
        );
        const copyComments = prev?.getComments
          ? [createdComment, ...prev.getComments]
          : [createdComment];
        return Object.assign({}, prev, {
          getComments: copyComments,
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
        apolloClient.cache.updateQuery(
          { query: GET_POST_BY_ID, variables: { idPost: idPost } },
          (dataCache) => {
            const filteredComments = dataCache.getPostById.comments.filter(
              (comment) => comment._id !== idDeletedComment
            );
            return {
              getPostById: {
                ...dataCache.getPostById,
                comments: filteredComments,
              },
            };
          }
        );
        const filteredComments = prev.getComments.filter(
          (comment) => comment._id !== idDeletedComment
        );
        return Object.assign({}, prev, {
          getComments: filteredComments,
        });
      },
    });
  }

  function handleSubscribeToToggledLikeComment() {
    subscribeToMore({
      document: TOGGLED_LIKE_COMMENT_SUB,
      variables: { idPost: idPost },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const {
          _id: idComment,
          user: { _id: idUserToggled },
        } = subscriptionData.data.toggledLikeComment;
        const indexComment = prev.getComments.findIndex(
          (c) => c._id === idComment
        );
        const copyLikes = Array.isArray(prev.getComments[indexComment]?.likes)
          ? [...prev.getComments[indexComment].likes]
          : [];
        if (copyLikes.find((like) => like._id === idUserToggled)) {
          copyLikes.splice(
            copyLikes.findIndex((like) => like._id === idUserToggled),
            1
          );
        } else {
          copyLikes.push({ __typename: "User", _id: idUserToggled });
        }
        let commentsCopy = [...prev.getComments];
        commentsCopy[indexComment] = {
          ...prev.getComments[indexComment],
          likes: copyLikes,
        };
        return Object.assign({}, prev, {
          getComments: commentsCopy,
        });
      },
    });
  }

  function handleSubscribeToUpdatedComment() {
    subscribeToMore({
      document: UPDATED_COMMENT_SUB,
      variables: { idPost: idPost },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedComment = subscriptionData.data.updatedComment;
        const indexComment = prev.getComments.findIndex(
          (c) => c._id === updatedComment._id
        );
        let commentsCopy = [...prev.getComments];
        commentsCopy[indexComment] = updatedComment;
        return Object.assign({}, prev, {
          getComments: commentsCopy,
        });
      },
    });
  }

  useEffect(() => {
    handleSubscribeToCreatedComment();
    handleSubscribeToDeletedComment();
    handleSubscribeToToggledLikeComment();
    handleSubscribeToUpdatedComment();
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
    <div
      className={
        "mb-16 flex w-full flex-col items-center justify-center px-2 text-xs md:text-sm"
      }
    >
      <div className={"mb-4 flex w-full items-center gap-x-2"}>
        <Avatar {...photoUser} />
        <form
          className={"flex grow items-center rounded-lg bg-gray-100 shadow-lg"}
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
      <div className={"w-3/4"}>
        {comments?.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            subscribeToMore={subscribeToMore}
          />
        ))}
      </div>
    </div>
  );
}

export default IndexComments;
