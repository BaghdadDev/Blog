import React from "react";

import ErrorGraphQL from "../components/ErrorGraphQL";
import SkeletonPosts from "../components/Skeleton/SkeletonPosts.jsx";
import Post from "../components/Post/Post.jsx";
import { useGetPosts } from "../features/post";
import { subCreatePost } from "../features/subscriptions";

function Posts() {
  const { posts, error, loading } = useGetPosts();
  subCreatePost();

  if (loading) return <SkeletonPosts />;

  if (error) {
    return <ErrorGraphQL errorGraphQL={error} />;
  }
  return (
    <div className={"flex w-full flex-col items-center px-2 py-2 md:mx-0"}>
      <div className={"flex w-full max-w-2xl flex-col items-center gap-y-2"}>
        {!posts || posts === 0 ? (
          <p className={"p-2 rounded bg-red-400 italic text-sm font-semibold"}>
            There are no posts to display !
          </p>
        ) : (
          posts.map((post) => <Post key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default Posts;
