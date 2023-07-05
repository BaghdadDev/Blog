import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RxUpdate } from "react-icons/rx";

import ErrorGraphQL from "../components/ErrorGraphQL";
import OvalLoader from "../components/OvalLoader.jsx";
import { useUserContext } from "../context/userContext.jsx";
import CustomInput from "../components/Custom/CustomInput.jsx";
import TextEditor from "../components/TextEditor/TextEditor.jsx";
import checkObjStoryEmpty from "../utils/checkObjStoryEmpty.jsx";
import { useGetPostById, useUpdatePost } from "../features/post/index.jsx";

function EditPost() {
  const { postId } = useParams();
  const { user } = useUserContext();
  const [story, setStory] = useState({ value: undefined, error: undefined });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    post,
    error: errorPost,
    loading: loadingPost,
  } = useGetPostById(postId);

  useEffect(() => {
    if (!post) return;
    setStory((prev) => ({ ...prev, value: post.story }));
  }, [post]);

  const {
    updatePostPicture,
    updatePostText,
    loadingUpdatePostPicture,
    loadingUpdatePostText,
  } = useUpdatePost(postId);

  async function handleUpdatePostPicture(e) {
    const file = e.target.files[0];
    updatePostPicture(file).then();
  }

  async function handleSubmitUpdatePostText(data) {
    setStory((prev) => ({ ...prev, error: undefined }));
    if (!checkObjStoryEmpty(JSON.parse(story.value))) {
      setStory((prev) => ({
        ...prev,
        error: "Please, do not let your story empty",
      }));
      return;
    }
    updatePostText(data.title, story.value).then();
  }

  if (loadingPost) {
    return (
      <div className={"flex min-h-screen w-full items-center justify-center"}>
        <OvalLoader />
      </div>
    );
  }

  if (errorPost) {
    return (
      <div className={"flex min-h-screen w-full items-center justify-center"}>
        <ErrorGraphQL errorGraphQL={errorPost} />;
      </div>
    );
  }

  return (
    <div
      className={
        "relative my-2 flex min-h-screen w-full max-w-3xl flex-col gap-y-2 pb-10"
      }
    >
      <h1 className={"self-center text-2xl font-semibold"}>Edit Post</h1>
      <div className={"relative w-full overflow-hidden"}>
        {loadingUpdatePostPicture ? (
          <div
            className={
              "absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-black opacity-50"
            }
          >
            <OvalLoader />
          </div>
        ) : undefined}
        {user._id === post.user._id ? (
          <label>
            <RxUpdate
              className={
                "absolute top-2 right-2 h-4 w-4 rounded-full transition-all hover:cursor-pointer md:h-7 md:w-7 md:bg-gray-50 md:bg-opacity-50 md:p-1 hover:md:bg-opacity-100"
              }
            />
            <input
              type={"file"}
              className={"hidden"}
              onChange={handleUpdatePostPicture}
            />
          </label>
        ) : undefined}
        <img
          src={`data:${post.picture.contentType};base64,${post.picture.data}`}
          alt={post.picture.filename}
          className={"rounded"}
        />
      </div>
      <form
        className={
          "flex flex-col items-center justify-center rounded-lg bg-gray-300 p-2"
        }
        onSubmit={handleSubmit(handleSubmitUpdatePostText)}
      >
        <CustomInput
          name={"title"}
          errors={errors}
          register={register}
          defaultValue={post.title}
        />
        <div className={"my-10 w-full"}>
          <TextEditor
            initValue={post.story}
            error={story.error}
            nameDraft={`textEditor-draft-${user._id}`}
            setValue={(value) => setStory((prev) => ({ ...prev, value }))}
          />
        </div>

        <button type={"submit"} className={"btn-form"}>
          {loadingUpdatePostText ? <OvalLoader /> : "Save"}
        </button>
      </form>
    </div>
  );
}

export default EditPost;
