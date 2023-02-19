import React, { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import CustomInput from "../components/Custom/CustomInput.jsx";
import CustomInputFile from "../components/Custom/CustomInputFile.jsx";
import OvalLoader from "../components/OvalLoader.jsx";
import { useUserContext } from "../context/userContext.jsx";
import { CREATE_POST, GET_POSTS } from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import TextEditor from "../components/TextEditor";
import PATH from "../utils/route-path.jsx";

function NewPost() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const refEditor = useRef(undefined);
  const [errorStory, setErrorStory] = useState("");

  const [createPost, { error: errorCreatePost }] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  function getStoryField() {
    setErrorStory("");
    if (localStorage.getItem("draft")) {
      const objStory = JSON.parse(localStorage.getItem("draft"));
      if (
        objStory.length === 1 &&
        Object.entries(objStory[0]).length === 2 &&
        objStory[0].type === "paragraph" &&
        Object.entries(objStory[0].children[0]).length === 1 &&
        objStory[0].children[0].text === ""
      ) {
        setErrorStory("Please, fill a story");
        return false;
      } else {
        const story = localStorage.getItem("draft");
        localStorage.removeItem("draft");
        return story;
      }
    }
    setErrorStory("Please, fill a story");
    return false;
  }

  async function handleSubmitNewPost(data) {
    const story = getStoryField();
    if (!story) return;
    const postInput = {
      title: data.title,
      story,
      user: user._id,
      picture: data.files[0],
    };
    console.log(postInput);
    try {
      await createPost({ variables: { postInput } });
      navigate(PATH.ROOT);
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
        error={errorStory}
      />

      <button type={"submit"} className={"btn-form"}>
        {isSubmitting ? <OvalLoader /> : "Save"}
      </button>
    </form>
  );
}

export default NewPost;
