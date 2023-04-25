import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";

import ErrorGraphQL from "../components/ErrorGraphQL";
import { CREATED_POST_SUB, GET_POSTS } from "../gql/post.jsx";
import Post from "../components/post/Post.jsx";
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
        return Object.assign({}, prev, {
          getPosts: [newPost, ...prev.getPosts],
        });
      },
    });
  }

  useEffect(() => {
    subscribeToCreatedPost();
  }, []);

  if (loadingGetPosts) return <SkeletonPosts />;

  if (errorGetPosts) return <ErrorGraphQL errorGraphQL={errorGetPosts} />;

  return (
    <div className={"flex w-full flex-col items-center px-2 py-2 md:mx-0"}>
      <p className={"hidden"}>posts list</p>
      <div className={"flex w-full max-w-2xl flex-col items-center gap-y-2"}>
        {dataGetPosts.getPosts.map((post) => (
          <Post
            key={post._id}
            post={post}
            subscribeToGetPosts={subscribeToMore}
          />
        ))}
      </div>
    </div>
  );
}

export default Posts;
