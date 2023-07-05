import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

import { GET_POST_BY_ID } from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import Avatar from "../components/Avatar.jsx";
import TextEditor from "../components/TextEditor/TextEditor.jsx";
import SkeletonPostDetails from "../components/Skeleton/SkeletonPostDetails.jsx";
import Comments from "../components/Comment/index.jsx";
import { UserContext } from "../context/userContext.jsx";
import OptionsPostDetails from "../components/Post/OptionsPostDetails.jsx";
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
        "relative mt-2 flex min-h-screen max-w-3xl flex-col items-center"
      }
      data-testid={`post-details-test`}
    >
      <div
        className={
          "mb-4 flex w-[calc(100%_-_20px)] items-center justify-between rounded-lg bg-slate-300 p-2 shadow-lg transition-all duration-300 md:mx-0 md:w-full"
        }
      >
        <div className={"flex items-center gap-x-2"}>
          <Avatar {...post.user.photo} />
          <div className={"flex flex-col"}>
            <p className={"font-semibold"}>
              {post.user.firstName.charAt(0).toUpperCase() +
                post.user.firstName.substring(1)}
            </p>
            <p className={"text-xs italic text-slate-600"}>{post.updatedAt}</p>
          </div>
        </div>
        {userContext ? (
          <div className={"flex items-center gap-x-2"}>
            <div
              className={`rounded-full p-1 hover:cursor-pointer hover:bg-slate-100 ${
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
          className={"rounded-none transition-all duration-300 md:rounded-xl"}
        />
      </div>
      <p className={"mb-4 text-3xl font-semibold"}>{post.title}</p>
      <div
        className={
          "mb-2 flex h-auto w-[calc(100%_-_20px)] transition-all duration-300 lg:w-full"
        }
      >
        <span
          className={
            "relative top-0 left-0 bottom-0 mr-3 w-[4px] rounded-full bg-slate-300 transition-all duration-500"
          }
        ></span>
        <div className={"relative grow rounded shadow-lg"}>
          <RiDoubleQuotesL
            className={
              "absolute top-0 left-0 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-slate-600"
            }
          />
          <RiDoubleQuotesR
            className={
              "absolute bottom-0 right-0 z-10 h-4 w-4 translate-x-1/2 translate-y-1/2 text-slate-600"
            }
          />
          <TextEditor readOnly={true} initValue={post.story} />
        </div>
      </div>
      <div className={"mr-2 flex items-center gap-x-2 self-end text-sm italic"}>
        <p>{post.likes.length} Likes</p>
        <p>{post.comments.length} Comments</p>
      </div>
      <div className={"mt-2 mb-4 flex items-center gap-x-4 self-center"}>
        <span className={"h-1 w-1 rounded-full bg-slate-600"}></span>
        <span className={"h-1 w-1 rounded-full bg-slate-600"}></span>
        <span className={"h-1 w-1 rounded-full bg-slate-600"}></span>
      </div>
      <Comments idPost={post._id} />
    </div>
  );
}

export default PostDetails;
