import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { GET_POST_BY_ID } from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import Avatar from "../components/Avatar.jsx";
import TextEditor from "../components/TextEditor/TextEditor.jsx";
import SkeletonPostDetails from "../components/Skeleton/SkeletonPostDetails.jsx";
import Comments from "../components/Comment/index.jsx";
import { UserContext } from "../context/userContext.jsx";
import OptionsPostDetails from "../components/Post/components/OptionsPostDetails.jsx";
import { useGetPostById, useToggleLikePost } from "../features/post/index.jsx";
import {
  subDeletePost,
  subToggleLikePost,
  subUpdatePost,
} from "../features/subscriptions/index.jsx";

function PostDetails() {
  const { postId } = useParams();

  const userContext = useContext(UserContext);

  const {
    post,
    error: errorGetPostById,
    loading: loadingGetPostById,
  } = useGetPostById(postId);

  const { toggleLikePost, loadingToggleLikePost, optimisticLike } =
    useToggleLikePost(post);

  subToggleLikePost(postId, "GET_POST_BY_ID");
  subDeletePost(postId, "GET_POST_BY_ID");
  subUpdatePost(postId, "GET_POST_BY_ID");

  if (loadingGetPostById)
    return (
      <div className={"my-2 min-h-screen w-full max-w-2xl"}>
        <SkeletonPostDetails />
      </div>
    );

  if (errorGetPostById) return <ErrorGraphQL errorGraphQL={errorGetPostById} />;

  return (
    <div
      className={
        "relative my-2 flex min-h-screen w-full max-w-2xl flex-col gap-y-2"
      }
      data-testid={`post-details-test`}
    >
      <div className={"flex w-full items-center justify-between px-2"}>
        <div className={"flex items-center gap-x-2"}>
          <Avatar {...post.user.photo} />
          <p className={"font-semibold"}>
            {post.user.firstName.charAt(0).toUpperCase() +
              post.user.firstName.substring(1)}{" "}
            {post.user.lastName.toUpperCase()}
          </p>
        </div>
        {userContext ? (
          <div className={"flex items-center gap-x-2"}>
            <div
              className={`rounded-lg p-1 hover:cursor-pointer hover:bg-gray-100 ${
                loadingToggleLikePost
                  ? "pointer-events-none"
                  : "pointer-events-auto"
              }`}
              data-testid={"button-toggleLikePost"}
              onClick={() => toggleLikePost()}
            >
              {!optimisticLike ? (
                <AiOutlineHeart className={"h-6 w-6 text-red-800"} />
              ) : (
                <AiFillHeart className={"h-6 w-6 text-red-800"} />
              )}
            </div>
            {userContext?.user?._id === post.user._id ? (
              <OptionsPostDetails idPost={postId} />
            ) : undefined}
          </div>
        ) : undefined}
      </div>
      <div className={"relative w-full overflow-hidden"}>
        <img
          src={`data:${post.picture.contentType};base64,${post.picture.data}`}
          alt={post.picture.filename}
          className={"rounded"}
        />
      </div>
      <p className={"text-center text-2xl font-semibold"}>{post.title}</p>
      <div className={"mx-2 shadow"}>
        <TextEditor readOnly={true} initValue={post.story} />
      </div>
      <div className={"mx-2 flex items-center gap-x-2 self-end text-sm italic"}>
        <p>{post.likes.length} Likes</p>
        <p>{post.comments.length} Comments</p>
      </div>
      <div className={"mt-2 mb-4 flex items-center gap-x-4 self-center"}>
        <span className={"h-1 w-1 rounded-full bg-gray-600"}></span>
        <span className={"h-1 w-1 rounded-full bg-gray-600"}></span>
        <span className={"h-1 w-1 rounded-full bg-gray-600"}></span>
      </div>
      <Comments idPost={post._id} />
    </div>
  );
}

export default PostDetails;
