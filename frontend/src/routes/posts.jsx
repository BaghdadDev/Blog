import React from "react";
import ErrorGraphQL from "../components/ErrorGraphQL";
import { GET_POSTS } from "../gql/post.jsx";
import Post from "../components/Post.jsx";
import { useQuery } from "@apollo/client";
import SkeletonPosts from "../components/Skeleton/SkeletonPosts.jsx";

function Posts() {
  const {
    data: dataGetPosts,
    error: errorGetPosts,
    loading: loadingGetPosts,
  } = useQuery(GET_POSTS);

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
