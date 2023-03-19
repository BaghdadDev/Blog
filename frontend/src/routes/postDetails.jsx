import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import apolloClient from "../config/apollo-client.jsx";

import {
  DISLIKED_POST_SUB,
  GET_POST_BY_ID,
  GET_POSTS,
  LIKED_POST_SUB,
  TOGGLE_LIKE_POST,
} from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import Avatar from "../components/Avatar.jsx";
import TextEditor from "../components/TextEditor/index.jsx";
import SkeletonPostDetails from "../components/Skeleton/SkeletonPostDetails.jsx";
import Comments from "../components/Comments";
import { useUserContext } from "../context/userContext.jsx";
import { CREATED_COMMENT_SUB } from "../gql/comment.jsx";
import OptionsPostDetails from "../components/Post/OptionsPostDetails.jsx";
import OvalLoader from "../components/OvalLoader.jsx";

function PostDetails() {
  const { postId } = useParams();

  const { user } = useUserContext();

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

  function subscribeToCreatedComment() {
    subscribeToMore({
      document: CREATED_COMMENT_SUB,
      variables: { idPost: postId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return Object.assign({}, prev, {
          getPostById: {
            ...prev.getPostById,
            nbrComments: prev.getPostById.nbrComments + 1,
          },
        });
      },
    });
  }

  function subscribeToLikedPost() {
    subscribeToMore({
      document: LIKED_POST_SUB,
      variables: { idPost: postId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { getPosts: posts } = apolloClient.readQuery({
          query: GET_POSTS,
        });
        const postLiked = posts.find((post) => post._id === postId);
        const newNbrLikes = postLiked.nbrLikes + 1;
        const copyPosts = [...posts];
        copyPosts.splice(
          posts.findIndex((post) => post._id === postId),
          1,
          { ...postLiked, nbrLikes: newNbrLikes }
        );
        apolloClient.writeQuery({
          query: GET_POSTS,
          data: {
            getPosts: [...copyPosts],
          },
        });
        const user = subscriptionData.data.likedPost;
        return Object.assign({}, prev, {
          getPostById: {
            ...prev.getPostById,
            likes: [...prev.getPostById.likes, user],
          },
        });
      },
    });
  }

  function subscribeToDislikedPost() {
    subscribeToMore({
      document: DISLIKED_POST_SUB,
      variables: { idPost: postId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        apolloClient.cache.updateQuery({ query: GET_POSTS }, (data) => {
          const indexPost = data.getPosts.findIndex((p) => p._id === postId);
          if (indexPost === -1) return { getPosts: [...data.getPosts] };
          let posts = [...data.getPosts];
          let post = { ...posts[indexPost] };
          post.nbrLikes--;
          posts.splice(indexPost, 1, post);
          return { getPosts: [...posts] };
        });
        const idUser = subscriptionData.data.dislikedPost;
        const filteredLikes = prev.getPostById.likes.filter(
          (like) => like._id !== idUser
        );
        return Object.assign({}, prev, {
          getPostById: {
            ...prev.getPostById,
            likes: [...filteredLikes],
          },
        });
      },
    });
  }

  useEffect(() => {
    subscribeToCreatedComment();
    subscribeToLikedPost();
    subscribeToDislikedPost();
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
      {loadingDeletingPost ? (
        <div
          className={
            "absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-gray-400 bg-opacity-50"
          }
        >
          <OvalLoader size={40} />
        </div>
      ) : undefined}
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
            <OptionsPostDetails
              idPost={postId}
              setLoadingDeletingPost={setLoadingDeletingPost}
            />
          ) : undefined}
        </div>
      </div>

      <p className={"text-center text-2xl font-semibold"}>{post.title}</p>
      <img
        src={`data:${post.picture.contentType};base64,${post.picture.data}`}
        alt={post.picture.filename}
        className={"rounded"}
      />
      <div className={"mx-2 shadow"}>
        <TextEditor readOnly={true} initValue={post.story} />
      </div>
      <div className={"mx-2 flex items-center gap-x-2 self-end text-sm italic"}>
        <p className={"flex items-center gap-x-1"}>
          <span>{post.likes.length}</span>
          <span>Likes</span>
        </p>
        <p className={"flex items-center gap-x-1"}>
          <span>{post.nbrComments}</span>
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
