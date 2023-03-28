import React, { useEffect } from "react";
import ErrorGraphQL from "../components/ErrorGraphQL";
import {
  CREATED_POST_SUB,
  DELETED_POST_SUB,
  GET_POSTS,
  TOGGLED_LIKE_POST_SUB,
  UPDATED_POST_SUB,
} from "../gql/post.jsx";
import Post from "../components/post/Post.jsx";
import { useQuery } from "@apollo/client";
import SkeletonPosts from "../components/Skeleton/SkeletonPosts.jsx";
import { TOGGLED_COMMENT_POST_SUB } from "../gql/comment.jsx";

function Posts() {
  const {
    subscribeToMore,
    data: dataGetPosts,
    error: errorGetPosts,
    loading: loadingGetPosts,
  } = useQuery(GET_POSTS);

  function subscribeToCreatedPost() {
    subscribeToMore({
      document: CREATED_POST_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newPost = subscriptionData.data.createdPost;
        return Object.assign({}, prev, {
          getPosts: [newPost, ...prev.getPosts],
        });
      },
    });
  }
  function subscribeToDeletedPost() {
    subscribeToMore({
      document: DELETED_POST_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const idDeletedPost = subscriptionData.data.deletedPost;
        console.log("ID deleted post :", idDeletedPost);
        const filteredPosts = prev.getPosts.filter(
          (post) => post._id !== idDeletedPost
        );
        return Object.assign({}, prev, {
          getPosts: [...filteredPosts],
        });
      },
    });
  }

  function subscribeToToggledLikePost() {
    subscribeToMore({
      document: TOGGLED_LIKE_POST_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const {
          _id: idPost,
          user: { _id: idUser },
        } = subscriptionData.data.toggledLikePost;
        const indexPost = prev.getPosts.findIndex(
          (post) => post._id === idPost
        );
        const copyLikes = Array.isArray(prev.getPosts[indexPost].likes)
          ? [...prev.getPosts[indexPost].likes]
          : [];
        if (
          prev.getPosts[indexPost].likes.find((like) => like._id === idUser)
        ) {
          copyLikes.splice(
            copyLikes.findIndex((like) => like._id === idUser),
            1
          );
        } else {
          copyLikes.push({ __typename: "User", _id: idUser });
        }
        let copyPosts = [...prev.getPosts];
        copyPosts[indexPost] = { ...copyPosts[indexPost], likes: copyLikes };
        return Object.assign({}, prev, {
          getPosts: copyPosts,
        });
      },
    });
  }

  function subscribeToToggledCommentPost() {
    subscribeToMore({
      document: TOGGLED_COMMENT_POST_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const {
          _id: idComment,
          post: { _id: idPost },
        } = subscriptionData.data.toggledCommentPost;
        const indexPost = prev.getPosts.findIndex(
          (post) => post._id === idPost
        );
        const copyComments = Array.isArray(prev.getPosts[indexPost].comments)
          ? [...prev.getPosts[indexPost].comments]
          : [];
        if (copyComments.find((comment) => comment._id === idComment)) {
          copyComments.splice(
            copyComments.findIndex((comment) => comment._id === idComment),
            1
          );
        } else {
          copyComments.push({ __typename: "Comment", _id: idComment });
        }
        let copyPosts = [...prev.getPosts];
        copyPosts[indexPost] = {
          ...copyPosts[indexPost],
          comments: copyComments,
        };
        return Object.assign({}, prev, {
          getPosts: copyPosts,
        });
      },
    });
  }

  function subscribeToUpdatedPost() {
    subscribeToMore({
      document: UPDATED_POST_SUB,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedPost = subscriptionData.data.updatedPost;
        const indexPost = prev.getPosts.findIndex(
          (post) => post._id === updatedPost._id
        );
        let copyPosts = [...prev.getPosts];
        copyPosts[indexPost] = updatedPost;
        return Object.assign({}, prev, {
          getPosts: copyPosts,
        });
      },
    });
  }

  useEffect(() => {
    subscribeToCreatedPost();
    subscribeToDeletedPost();
    subscribeToToggledLikePost();
    subscribeToToggledCommentPost();
    subscribeToUpdatedPost();
  }, []);

  if (loadingGetPosts) return <SkeletonPosts />;

  if (errorGetPosts) return <ErrorGraphQL errorGraphQL={errorGetPosts} />;

  return (
    <div className={"flex w-full flex-col items-center px-2 py-2 md:mx-0"}>
      <div className={"flex w-full max-w-2xl flex-col items-center gap-y-2"}>
        {dataGetPosts.getPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Posts;
