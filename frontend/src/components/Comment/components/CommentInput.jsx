import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import OvalLoader from "../../OvalLoader.jsx";
import { useUpdateComment } from "../../../features/comment/index.jsx";

function CommentInput({ readyOnly, setReadOnly, idComment, text }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { updateComment, loadingUpdateComment } = useUpdateComment();

  async function handleUpdateComment(data) {
    updateComment(idComment, data.updatedComment);
    setReadOnly(true);
  }

  if (readyOnly) {
    return <p className={"grow rounded p-1"}>{text}</p>;
  }
  return (
    <form
      onSubmit={handleSubmit(handleUpdateComment)}
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
              "absolute bottom-0 translate-y-[calc(100%_+_2px)] rounded bg-red-300 p-[1px] text-xs italic opacity-90 md:text-sm"
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
