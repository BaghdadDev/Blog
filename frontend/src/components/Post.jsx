import React from "react";
import Avatar from "./Avatar.jsx";
import { useUserContext } from "../context/userContext.jsx";
import { AiFillDelete } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import { DELETE_POST, GET_POSTS } from "../gql/post.jsx";
import OvalLoader from "./OvalLoader.jsx";
import ErrorGraphQL from "./ErrorGraphQL";
import TextEditor from "./TextEditor/index.jsx";

function Post({ post }) {
  const { user } = useUserContext();

  const [deletePost, { error: errorDeletePost, loading: loadingDeletePost }] =
    useMutation(DELETE_POST, { refetchQueries: [{ query: GET_POSTS }] });

  async function handleDeletePost() {
    try {
      await deletePost({ variables: { idPost: post._id } });
    } catch (errorDeletingPost) {
      console.log(errorDeletingPost);
    }
  }

  return (
    <div
      className={
        "relative flex w-full flex-col gap-y-2 overflow-hidden rounded bg-white"
      }
    >
      {user._id === post.user._id && (
        <AiFillDelete
          onClick={handleDeletePost}
          className={
            "absolute top-2 right-2 h-4 w-4 text-red-400 hover:cursor-pointer hover:text-red-800"
          }
        />
      )}
      {loadingDeletePost && (
        <div
          className={
            "absolute top-0 right-0 flex h-full w-full items-center justify-center bg-gray-600 opacity-50"
          }
        >
          <OvalLoader size={40} />
        </div>
      )}
      {errorDeletePost && <ErrorGraphQL errorGraphQL={errorDeletePost} />}
      <div className={"mt-2 flex items-center gap-x-2 pl-2"}>
        <Avatar {...post.user.photo} />
        <p className={"font-semibold"}>
          {post.user.firstName.charAt(0).toUpperCase() +
            post.user.firstName.substring(1)}{" "}
          {post.user.lastName.toUpperCase()}
        </p>
      </div>
      <img
        src={`data:${post.picture.contentType};base64,${post.picture.data}`}
        alt={post.picture.filename}
        className={"w-full"}
      />
      <p className={" w-full text-center font-semibold"}>{post.title}</p>
      <TextEditor readOnly={true} initValue={post.story} />
    </div>
  );
}

export default Post;
