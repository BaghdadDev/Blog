import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RxUpdate } from "react-icons/rx";

import {
  GET_POST_BY_ID,
  UPDATE_POST_PICTURE,
  UPDATE_POST_TEXT,
} from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import OvalLoader from "../components/OvalLoader.jsx";
import { useUserContext } from "../context/userContext.jsx";
import CustomInput from "../components/Custom/CustomInput.jsx";
import TextEditor from "../components/TextEditor/TextEditor.jsx";
import apolloClient from "../config/apollo-client.jsx";
import PATH from "../utils/route-path.jsx";

function EditPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useUserContext();
  const [story, setStory] = useState({ value: undefined, error: undefined });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const {
    data: dataPost,
    loading: loadingPost,
    error: errorPost,
  } = useQuery(GET_POST_BY_ID, {
    variables: { idPost: postId },
    onCompleted: ({ getPostById }) => {
      setStory((prev) => ({ ...prev, value: getPostById.story }));
    },
  });

  const [updatePostPicture, { loading: loadingUpdatePostPicture }] =
    useMutation(UPDATE_POST_PICTURE, {
      onCompleted: (res) => {
        apolloClient.cache.updateQuery(
          { query: GET_POST_BY_ID, variables: { idPost: postId } },
          (dataCache) => {
            return {
              getPostById: {
                ...dataCache.getPostById,
                picture: res.updatePostPicture,
              },
            };
          }
        );
      },
    });

  const [updatePostText, { loading: loadingUpdatePostText }] = useMutation(
    UPDATE_POST_TEXT,
    {
      onCompleted: (res) => {
        apolloClient.cache.updateQuery(
          { query: GET_POST_BY_ID, variables: { idPost: postId } },
          (dataCache) => {
            return { getPostById: res.updatePostText };
          }
        );
        localStorage.removeItem(`textEditor-draft-${user._id}`);
        navigate(PATH.POST_DETAILS.split(":postId")[0] + postId);
      },
    }
  );

  async function handleUpdatePostPicture(e) {
    const file = e.target.files[0];
    try {
      await updatePostPicture({
        variables: { idPost: postId, picture: file },
      });
    } catch (errorUpdatePostPicture) {
      console.log(errorUpdatePostPicture);
    }
  }

  function checkIfStoryIsEmpty(objStory) {
    return !(
      objStory.length === 1 &&
      Object.entries(objStory[0]).length === 2 &&
      objStory[0].type === "paragraph" &&
      objStory[0].children[0].text === ""
    );
  }

  async function handleSubmitUpdatePostText(data) {
    setStory((prev) => ({ ...prev, error: undefined }));
    if (!checkIfStoryIsEmpty(JSON.parse(story.value))) {
      setStory((prev) => ({
        ...prev,
        error: "Please, don't let your story empty",
      }));
      return;
    }
    const postInput = {
      title: data.title,
      story: story.value,
    };
    try {
      await updatePostText({
        variables: { idPost: postId, postInput: postInput },
      });
    } catch (errorSubmittingUpdatePost) {
      console.log(errorSubmittingUpdatePost);
    }
  }

  if (loadingPost) {
    return <div>Loading ...</div>;
  }

  if (errorPost) {
    return (
      <div>
        <ErrorGraphQL errorGraphQL={errorPost} />
      </div>
    );
  }

  const post = dataPost.getPostById;

  return (
    <div
      className={
        "relative my-2 flex min-h-screen w-full max-w-2xl flex-col gap-y-2 pb-10"
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
            setValue={(value) =>
              setStory((prev) => ({ ...prev, value: value }))
            }
          />
        </div>

        <button type={"submit"} className={"btn-form"}>
          {isSubmitting || loadingUpdatePostText ? <OvalLoader /> : "Save"}
        </button>
      </form>
    </div>
  );
}

export default EditPost;
