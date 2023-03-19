import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";

import { GET_POST_BY_ID, UPDATE_POST } from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL.jsx";
import CustomInputFile from "../components/Custom/CustomInputFile.jsx";
import CustomInput from "../components/Custom/CustomInput.jsx";
import TextEditor from "../components/TextEditor/index.jsx";
import OvalLoader from "../components/OvalLoader.jsx";
import { useForm } from "react-hook-form";
import PATH from "../utils/route-path.jsx";

function EditPost() {
  const { postId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [errorStory, setErrorStory] = useState("");

  const {
    data: dataPost,
    loading: loadingPost,
    error: errorPost,
  } = useQuery(GET_POST_BY_ID, { variables: { idPost: postId } });

  const [updatePost, { error: errorUpdatePost }] = useMutation(UPDATE_POST);

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

  async function handleSubmitUpdatePost(data) {
    const story = getStoryField();
    if (!story) return;
    const postInput = {
      title: data.title,
      story,
      picture: data.files[0],
    };
    console.log(postInput);
    try {
      await updatePost({ variables: { postInput } });
      // navigate(PATH.ROOT);
    } catch (err) {}
  }

  if (loadingPost) return <p>Loading Post ...</p>;

  if (errorPost) return <ErrorGraphQL errorGraphQL={errorPost} />;

  const post = dataPost.getPostById;

  return (
    <form
      onSubmit={handleSubmit(handleSubmitUpdatePost)}
      className={
        "relative flex w-full max-w-2xl flex-col items-center gap-y-10 rounded-lg bg-blue-500 px-2 py-4"
      }
    >
      {errorUpdatePost && <ErrorGraphQL errorGraphQL={errorUpdatePost} />}
      <h1 className={"text-3xl font-semibold text-gray-200 md:text-4xl"}>
        Edit Post
      </h1>
      <CustomInputFile
        size={10}
        name={"files"}
        errors={errors}
        register={register}
        rules={{ required: "Please, enter a picture" }}
        defaultValue={post.picture}
      />
      <CustomInput
        name={"title"}
        placeholder={"Title"}
        register={register}
        errors={errors}
        rules={{ required: "Please, enter a title" }}
        defaultValue={post.title}
      />
      <TextEditor error={errorStory} initValue={post.story} />
      <button type={"submit"} className={"btn-form"}>
        {isSubmitting ? <OvalLoader /> : "Save"}
      </button>
    </form>
  );
}

export default EditPost;
