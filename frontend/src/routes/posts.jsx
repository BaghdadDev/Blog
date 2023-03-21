import React, { useEffect } from "react";
import ErrorGraphQL from "../components/ErrorGraphQL";
import { CREATED_POST_SUB, DELETED_POST_SUB, GET_POSTS } from "../gql/post.jsx";
import Post from "../components/post/Post.jsx";
import { useQuery } from "@apollo/client";
import SkeletonPosts from "../components/Skeleton/SkeletonPosts.jsx";

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
        console.log(newPost);
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

  useEffect(() => {
    subscribeToCreatedPost();
    subscribeToDeletedPost();
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
