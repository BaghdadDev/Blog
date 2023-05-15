import React, { useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";

import ErrorGraphQL from "../components/ErrorGraphQL";
import { CREATED_POST_SUB, GET_POSTS } from "../gql/post.jsx";
import Post from "../components/post/Post.jsx";
import SkeletonPosts from "../components/Skeleton/SkeletonPosts.jsx";
import apolloClient from "../config/apollo-client.jsx";

function Posts() {
  const {
    subscribeToMore,
    data: dataGetPosts,
    error: errorGetPosts,
    loading: loadingGetPosts,
  } = useQuery(GET_POSTS);

  const { data: dataSubCreatedPost, error: errorSubCreatedPost } =
    useSubscription(CREATED_POST_SUB);

  useEffect(() => {
    if (dataSubCreatedPost && !errorSubCreatedPost) {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => ({
        getPosts: [
          { ...dataSubCreatedPost.createdPost },
          ...dataCache.getPosts,
        ],
      }));
    }
  }, [dataSubCreatedPost, errorSubCreatedPost]);

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
