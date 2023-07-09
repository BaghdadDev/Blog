import React, { useState } from "react";
import { useForm } from "react-hook-form";

import CustomInput from "../components/Custom/CustomInput.jsx";
import CustomInputFile from "../components/Custom/CustomInputFile.jsx";
import OvalLoader from "../components/OvalLoader.jsx";
import { useUserContext } from "../context/userContext.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import TextEditor from "../components/TextEditor/TextEditor.jsx";
import { useCreatePost } from "../features/post/index.jsx";
import checkObjStoryEmpty from "../utils/checkObjStoryEmpty.jsx";

function NewPost() {
  const { user } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [story, setStory] = useState({ value: undefined, error: undefined });

  const { createPost, errorCreatePost, loadingCreatePost } = useCreatePost();

  function handleCreatePost(data) {
    setStory((prev) => ({ ...prev, error: undefined }));
    if (!checkObjStoryEmpty(JSON.parse(story.value))) {
      setStory((prev) => ({
        ...prev,
        error: "Please, fill your story",
      }));
      return;
    }
    createPost(data.title, story.value, data.files[0]);
  }

  return (
    <div
      className={
        "flex w-[calc(100%_-_10px)] max-w-3xl grow flex-col items-center"
      }
    >
      <h1 className={"my-4 text-3xl font-semibold text-slate-800 md:text-4xl"}>
        New Post
      </h1>
      <form
        onSubmit={handleSubmit(handleCreatePost)}
        className={
          "relative flex w-full flex-col items-center gap-y-10 rounded-lg bg-slate-400 px-2 py-4"
        }
      >
        {errorCreatePost && <ErrorGraphQL errorGraphQL={errorCreatePost} />}

        <CustomInputFile
          size={10}
          name={"files"}
          errors={errors}
          register={register}
          rules={{ required: "Please, enter a picture" }}
        />
        <CustomInput
          name={"title"}
          placeholder={"Title"}
          register={register}
          errors={errors}
          rules={{ required: "Please, enter a title" }}
        />
        <TextEditor
          placeholder={"Type your story or whatever you want ;)"}
          error={story.error}
          nameDraft={`textEditor-draft-${user._id}`}
          setValue={(value) => setStory((prev) => ({ ...prev, value: value }))}
        />

        <button type={"submit"} className={"btn-form"}>
          {loadingCreatePost ? <OvalLoader /> : "Save"}
        </button>
      </form>
    </div>
  );
}

export default NewPost;
