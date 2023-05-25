import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import CustomInput from "../components/Custom/CustomInput.jsx";
import CustomInputFile from "../components/Custom/CustomInputFile.jsx";
import OvalLoader from "../components/OvalLoader.jsx";
import { useUserContext } from "../context/userContext.jsx";
import { CREATE_POST, GET_POSTS } from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import TextEditor from "../components/TextEditor/TextEditor.jsx";
import PATH from "../utils/route-path.jsx";
import apolloClient from "../config/apollo-client.jsx";

function NewPost() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [story, setStory] = useState({ value: undefined, error: undefined });

  const [createPost, { error: errorCreatePost }] = useMutation(CREATE_POST, {
    onCompleted: ({ createPost }) => {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
        const posts = Array.isArray(dataCache?.getPosts)
          ? dataCache.getPosts
          : [];
        return { getPosts: [createPost, ...posts] };
      });
      navigate(PATH.ROOT);
    },
  });

  function checkIfStoryIsEmpty(objStory) {
    return !(
      objStory.length === 1 &&
      Object.entries(objStory[0]).length === 2 &&
      objStory[0].type === "paragraph" &&
      objStory[0].children[0].text === ""
    );
  }

  async function handleSubmitNewPost(data) {
    setStory((prev) => ({ ...prev, error: undefined }));
    if (!checkIfStoryIsEmpty(JSON.parse(story.value))) {
      setStory((prev) => ({
        ...prev,
        error: "Please, don't fill your story",
      }));
      return;
    }
    const postInput = {
      title: data.title,
      story: story.value,
      user: user._id,
      picture: data.files[0],
    };
    try {
      await createPost({ variables: { postInput } });
    } catch (err) {}
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitNewPost)}
      className={
        "relative flex w-full max-w-2xl flex-col items-center gap-y-10 rounded-lg bg-blue-500 px-2 py-4"
      }
    >
      {errorCreatePost && <ErrorGraphQL errorGraphQL={errorCreatePost} />}
      <h1 className={"text-3xl font-semibold text-gray-200 md:text-4xl"}>
        New Post
      </h1>
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
        {isSubmitting ? <OvalLoader /> : "Save"}
      </button>
    </form>
  );
}

export default NewPost;
