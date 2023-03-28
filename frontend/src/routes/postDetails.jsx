import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import {
  DELETED_POST_DETAILS_SUB,
  GET_POST_BY_ID,
  GET_POSTS,
  TOGGLE_LIKE_POST,
  TOGGLED_LIKE_POST_DETAILS_SUB,
  UPDATED_POST_PICTURE_SUB,
  UPDATED_POST_TEXT_SUB,
} from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import Avatar from "../components/Avatar.jsx";
import TextEditor from "../components/TextEditor/index.jsx";
import SkeletonPostDetails from "../components/Skeleton/SkeletonPostDetails.jsx";
import Comments from "../components/Comments";
import { useUserContext } from "../context/userContext.jsx";
import OptionsPostDetails from "../components/Post/OptionsPostDetails.jsx";
import OvalLoader from "../components/OvalLoader.jsx";
import apolloClient from "../config/apollo-client.jsx";
import PATH from "../utils/route-path.jsx";

function PostDetails() {
  const { postId } = useParams();

  const { user } = useUserContext();

  const navigate = useNavigate();

  const [loadingDeletingPost, setLoadingDeletingPost] = useState(false);

  const {
    subscribeToMore,
    data: dataPost,
    loading: loadingPost,
    error: errorPost,
  } = useQuery(GET_POST_BY_ID, { variables: { idPost: postId } });

  const [toggleLikePost, { loading: loadingToggleLikePost }] =
    useMutation(TOGGLE_LIKE_POST);

  async function handleToggleLikePost() {
    try {
      await toggleLikePost({
        variables: { idPost: postId, idUser: user._id },
      });
    } catch (errorToggleLikePost) {
      console.log(errorToggleLikePost);
    }
  }

  async function handleUpdatePostPicture(e) {
    const file = e.target.files[0];
    try {
      const res = await updatePostPicture({
        variables: { idPost: postId, picture: file },
      });
    } catch (errorUpdatePostPicture) {
      console.log(errorUpdatePostPicture);
    }
  }

  function subscribeToUpdatedPostPicture() {
    subscribeToMore({
      document: UPDATED_POST_PICTURE_SUB,
      variables: { idPost: postId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newPostPicture = subscriptionData.data.updatedPostPicture;
        return Object.assign({}, prev, {
          getPostById: {
            ...prev.getPostById,
            picture: newPostPicture,
          },
        });
      },
    });
  }

  function subscribeToToggledLikePostDetails() {
    subscribeToMore({
      document: TOGGLED_LIKE_POST_DETAILS_SUB,
      variables: { idPost: postId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { _id: idUserToggledLike } =
          subscriptionData.data.toggledLikePostDetails;
        const copyPost = { ...prev.getPostById };
        const copyLikes = [...copyPost.likes];
        if (copyLikes.find(({ _id }) => _id === idUserToggledLike)) {
          copyLikes.splice(
            copyLikes.findIndex(({ _id }) => _id === idUserToggledLike),
            1
          );
        } else {
          copyLikes.push({ _id: idUserToggledLike });
        }
        return Object.assign({}, prev, {
          getPostById: {
            ...prev.getPostById,
            likes: copyLikes,
          },
        });
      },
    });
  }

  function subscribeToDeletedPostDetails() {
    subscribeToMore({
      document: DELETED_POST_DETAILS_SUB,
      variables: { idPost: postId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const idDeletedPost = subscriptionData.data.deletedPostDetails;
        apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
          if (!dataCache?.getPosts) return { getPosts: [] };
          const filteredPosts = dataCache.getPosts.filter(
            (post) => post._id !== idDeletedPost
          );
          return { getPosts: filteredPosts };
        });
        Object.assign({}, prev, {
          getPostById: undefined,
        });
        navigate(PATH.ROOT);
      },
    });
  }

  function subscribeToUpdatedPostText() {
    subscribeToMore({
      document: UPDATED_POST_TEXT_SUB,
      variables: { idPost: postId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedPostText = subscriptionData.data.updatedPostText;
        Object.assign({}, prev, {
          getPostById: updatedPostText,
        });
      },
    });
  }

  useEffect(() => {
    subscribeToUpdatedPostPicture();
    subscribeToToggledLikePostDetails();
    subscribeToDeletedPostDetails();
    subscribeToUpdatedPostText();
  }, []);

  if (loadingPost)
    return (
      <div className={"my-2 min-h-screen w-full max-w-2xl"}>
        <SkeletonPostDetails />
      </div>
    );

  if (errorPost) return <ErrorGraphQL errorGraphQL={errorPost} />;

  const post = dataPost.getPostById;

  return (
    <div
      className={
        "relative my-2 flex min-h-screen w-full max-w-2xl flex-col gap-y-2"
      }
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
        <div className={"flex items-center gap-x-2"}>
          <div
            className={`rounded-lg p-1 hover:cursor-pointer hover:bg-gray-100 ${
              loadingToggleLikePost
                ? "pointer-events-none"
                : "pointer-events-auto"
            }`}
            onClick={handleToggleLikePost}
          >
            {post.likes.findIndex(({ _id: userId }) => userId === user._id) ===
            -1 ? (
              <AiOutlineHeart className={"h-6 w-6 text-red-800"} />
            ) : (
              <AiFillHeart className={"h-6 w-6 text-red-800"} />
            )}
          </div>
          {user._id === post.user._id ? (
            loadingDeletingPost ? (
              <OvalLoader />
            ) : (
              <OptionsPostDetails
                idPost={postId}
                setLoadingDeletingPost={setLoadingDeletingPost}
              />
            )
          ) : undefined}
        </div>
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
        <p className={"flex items-center gap-x-1"}>
          <span>{post.likes.length}</span>
          <span>Likes</span>
        </p>
        <p className={"flex items-center gap-x-1"}>
          <span>{post.comments.length}</span>
          <span>Comments</span>
        </p>
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
