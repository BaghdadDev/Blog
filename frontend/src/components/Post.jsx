import React from "react";
import { useMutation } from "@apollo/client";
import { AiFillDelete, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { Node } from "slate";

import Avatar from "./Avatar.jsx";
import { useUserContext } from "../context/userContext.jsx";
import { DELETE_POST, GET_POSTS } from "../gql/post.jsx";
import OvalLoader from "./OvalLoader.jsx";
import ErrorGraphQL from "./ErrorGraphQL";
import PATH from "../utils/route-path.jsx";
import { Link } from "react-router-dom";

function Post({ post }) {
  const { user } = useUserContext();

  const [deletePost, { error: errorDeletePost, loading: loadingDeletePost }] =
    useMutation(DELETE_POST, { refetchQueries: [{ query: GET_POSTS }] });

  function textToString(value) {
    return JSON.parse(value)
      .map((n) => Node.string(n))
      .join(" ");
  }

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
        "relative flex w-full flex-col gap-y-1 overflow-hidden rounded bg-white"
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
      <Link to={PATH.POST_DETAILS.split(":")[0] + `${post._id}`}>
        <img
          src={`data:${post.picture.contentType};base64,${post.picture.data}`}
          alt={post.picture.filename}
          className={"w-full hover:cursor-pointer"}
        />
      </Link>
      <p className={"pl-2 font-semibold"}>{post.title}</p>
      <p className={"w-full truncate px-2"}>{textToString(post.story)}</p>
      <div
        className={"mb-2 flex w-full select-none items-center justify-evenly "}
      >
        <div className={"flex items-center gap-x-2"}>
          {post.nbrLikes === 0 ? (
            <>
              <AiOutlineHeart className={"h-6 w-6 text-red-800"} />
              <span>0</span>
            </>
          ) : (
            <>
              <AiFillHeart className={"h-6 w-6 text-red-800"} />
              <span>{post.nbrLikes}</span>
            </>
          )}
        </div>
        <div className={"flex items-center gap-x-2"}>
          <FaRegCommentDots className={"h-6 w-6 text-gray-800"} />
          <span>{post.nbrComments}</span>
        </div>
      </div>
    </div>
  );
}

export default Post;
