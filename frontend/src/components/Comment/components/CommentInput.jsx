import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useMutation } from "@apollo/client";

import { UPDATE_COMMENT } from "../../../gql/comment.jsx";
import OvalLoader from "../../OvalLoader.jsx";

function CommentInput({ readyOnly, setReadOnly, idComment, text }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [updateComment, { loading: loadingUpdateComment }] =
    useMutation(UPDATE_COMMENT);

  async function handleSubmitUpdateComment(data) {
    const commentInput = {
      comment: data.updatedComment,
    };
    try {
      await updateComment({
        variables: { idComment: idComment, commentInput: commentInput },
      });
      setReadOnly(true);
    } catch (errorSubmittingUpdatedComment) {
      console.log(errorSubmittingUpdatedComment);
    }
  }

  if (readyOnly) {
    return <p className={"grow rounded p-1"}>{text}</p>;
  }
  return (
    <form
      onSubmit={handleSubmit(handleSubmitUpdateComment)}
      className={
        "relative flex grow flex-col items-center justify-center overflow-hidden rounded bg-white text-xs md:text-sm"
      }
    >
      {loadingUpdateComment ? (
        <div
          className={
            "absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
          }
        >
          <OvalLoader size={15} />
        </div>
      ) : undefined}

      <input
        {...register("updatedComment", {
          required: "Do not leave an empty comment",
        })}
        type={"text"}
        defaultValue={text}
        className={"w-full px-2 py-1 outline-none"}
      />
      <ErrorMessage
        errors={errors}
        name={"updatedComment"}
        render={({ message }) => (
          <p
            className={
              "absolute bottom-0 translate-y-[calc(100%_+_2px)] rounded bg-red-300 p-[1px] text-xs text-xs italic opacity-90 md:text-sm"
            }
          >
            {message}
          </p>
        )}
      />
      <button type={"submit"} className={"hidden"}></button>
    </form>
  );
}

export default CommentInput;
