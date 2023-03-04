import React from "react";
import { BiSend } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";

import Avatar from "../Avatar.jsx";
import CustomInput from "../Custom/CustomInput.jsx";
import { useUserContext } from "../../context/userContext.jsx";
import { CREATE_COMMENT } from "../../gql/comment.jsx";
import { GET_POST_BY_ID } from "../../gql/post.jsx";
import Comment from "./Comment.jsx";

function IndexComments({ post }) {
  const {
    user: { _id: idUser, photo: photoUser },
  } = useUserContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [createComment, { loading: loadingCreateComment }] = useMutation(
    CREATE_COMMENT,
    {
      refetchQueries: [
        { query: GET_POST_BY_ID, variables: { idPost: post._id } },
      ],
    }
  );

  async function handleSubmitComment(data) {
    try {
      const commentInput = {
        user: idUser,
        post: post._id,
        comment: data.commentText,
      };
      await createComment({ variables: { commentInput: commentInput } });
      reset();
    } catch (errorSubmittingComment) {
      console.log(errorSubmittingComment);
    }
  }

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
        {post.comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default IndexComments;
