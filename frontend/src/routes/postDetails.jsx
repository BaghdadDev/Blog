import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";

import { GET_POST_BY_ID, TOGGLE_LIKE_POST } from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import Avatar from "../components/Avatar.jsx";
import TextEditor from "../components/TextEditor/index.jsx";
import SkeletonPostDetails from "../components/Skeleton/SkeletonPostDetails.jsx";
import Comments from "../components/Comments";
import { useUserContext } from "../context/userContext.jsx";

function PostDetails() {
  const { postId } = useParams();

  const {
    user: { _id: idUser },
  } = useUserContext();

  const {
    data: dataPost,
    loading: loadingPost,
    error: errorPost,
  } = useQuery(GET_POST_BY_ID, { variables: { idPost: postId } });

  const [toggleLikePost, { loading: loadingToggleLikePost }] = useMutation(
    TOGGLE_LIKE_POST,
    {
      refetchQueries: [
        { query: GET_POST_BY_ID, variables: { idPost: postId } },
      ],
    }
  );

  async function handleToggleLikePost() {
    try {
      await toggleLikePost({
        variables: { idPost: postId, idUser: idUser },
      });
    } catch (errorToggleLikePost) {
      console.log(errorToggleLikePost);
    }
  }

  if (loadingPost)
    return (
      <div className={"my-2 min-h-screen w-full max-w-2xl"}>
        <SkeletonPostDetails />
      </div>
    );

  if (errorPost) return <ErrorGraphQL errorGraphQL={errorPost} />;

  const post = dataPost.getPostById;

  return (
    <div className={"my-2 flex min-h-screen w-full max-w-2xl flex-col gap-y-2"}>
      <div className={"flex items-center gap-x-2"}>
        <Avatar {...post.user.photo} />
        <p className={"font-semibold"}>
          {post.user.firstName.charAt(0).toUpperCase() +
            post.user.firstName.substring(1)}{" "}
          {post.user.lastName.toUpperCase()}
        </p>
      </div>
      <p className={"text-center text-2xl font-semibold"}>{post.title}</p>
      <img
        src={`data:${post.picture.contentType};base64,${post.picture.data}`}
        alt={post.picture.filename}
        className={"rounded"}
      />
      <div className={"flex w-full items-center justify-evenly"}>
        <div
          className={`flex items-center gap-x-2 rounded-lg bg-white py-1 px-2 hover:cursor-pointer hover:bg-gray-100 ${
            loadingToggleLikePost
              ? "pointer-events-none"
              : "pointer-events-auto"
          }`}
          onClick={handleToggleLikePost}
        >
          {post.likes.findIndex(({ _id: userId }) => userId === idUser) ===
          -1 ? (
            <AiOutlineHeart className={"h-6 w-6 text-red-800"} />
          ) : (
            <AiFillHeart className={"h-6 w-6 text-red-800"} />
          )}
          <span>{post.likes.length}</span>
        </div>
        <div
          className={
            "flex items-center gap-x-2 rounded-lg bg-white py-1 px-2 hover:cursor-pointer hover:bg-gray-100"
          }
        >
          <FaRegCommentDots className={"h-6 w-6 text-gray-800"} />
          <span>{post.comments.length}</span>
        </div>
      </div>
      <TextEditor readOnly={true} initValue={post.story} />
      <Comments post={post} />
    </div>
  );
}

export default PostDetails;
