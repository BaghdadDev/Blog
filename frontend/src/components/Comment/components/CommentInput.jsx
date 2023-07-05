import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { GiSaveArrow } from "react-icons/gi";

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
    updateComment(idComment, data.updatedComment).then();
    setReadOnly(true);
  }

  useEffect(() => {
    if (readyOnly) return;
    document.getElementById(`input-update-comment-${idComment}`).focus();
  }, [readyOnly]);

  if (readyOnly) {
    return <p className={"grow rounded p-1"}>{text}</p>;
  }
  return (
    <form
      onSubmit={handleSubmit(handleUpdateComment)}
      className={`relative flex grow flex-col items-center justify-center overflow-hidden rounded text-xs md:text-sm`}
    >
      {loadingUpdateComment ? (
        <div
          className={
            "absolute top-0 left-0 flex h-full w-full items-center justify-center"
          }
        >
          <OvalLoader size={15} />
        </div>
      ) : undefined}

      <div className={"flex w-full items-center"}>
        <input
          {...register("updatedComment", {
            required: "Do not leave an empty comment",
          })}
          type={"text"}
          defaultValue={text}
          className={"w-full grow bg-transparent p-1 py-2 outline-none"}
          id={`input-update-comment-${idComment}`}
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
        <button
          type={"submit"}
          className={"rounded-full p-1 hover:cursor-pointer hover:bg-slate-200"}
        >
          <GiSaveArrow className={"h-4 w-4 text-slate-800"} />
        </button>
      </div>
    </form>
  );
}

export default CommentInput;
