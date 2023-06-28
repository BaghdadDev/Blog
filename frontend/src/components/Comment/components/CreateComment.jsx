import React from "react";
import { useCreateComment } from "../../../features/comment/index.jsx";
import Avatar from "../../Avatar.jsx";
import CustomInput from "../../Custom/CustomInput.jsx";
import { BiSend } from "react-icons/bi";
import { useUserContext } from "../../../context/userContext.jsx";
import { useForm } from "react-hook-form";

function CreateComment({ idPost }) {
  const userContext = useUserContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { createComment, loadingCreateComment } = useCreateComment();

  function handleCreateComment(data) {
    createComment(idPost, data.text).then(() => reset());
  }
  return userContext ? (
    <div className={"mb-4 flex w-full items-center gap-x-2"}>
      <Avatar {...userContext.user?.photo} />
      <form
        className={"flex grow items-center rounded-lg bg-gray-100 shadow-lg"}
        onSubmit={handleSubmit(handleCreateComment)}
      >
        <CustomInput
          name={"text"}
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
  ) : undefined;
}

export default CreateComment;
