import React from "react";
import { useQuery, useSubscription } from "@apollo/client";

import ErrorGraphQL from "../components/ErrorGraphQL";
import SkeletonPosts from "../components/Skeleton/SkeletonPosts.jsx";
import Post from "../components/post/Post.jsx";
import apolloClient from "../config/apollo-client.jsx";
import { CREATED_POST_SUB, GET_POSTS } from "../gql/post.jsx";

function Posts() {
  const {
    data: dataGetPosts,
    error: errorGetPosts,
    loading: loadingGetPosts,
  } = useQuery(GET_POSTS);

  useSubscription(CREATED_POST_SUB, {
    onData: ({
      data: {
        data: { createdPost },
      },
    }) => {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
        const posts = Array.isArray(dataCache?.getPosts)
          ? dataCache.getPosts
          : [];
        return {
          getPosts: [createdPost, ...posts],
        };
      });
    },
  });

  if (loadingGetPosts) return <SkeletonPosts />;

  if (errorGetPosts) {
    if (errorGetPosts?.graphQLErrors[0]?.extensions?.code !== "NOT-FOUND")
      return <ErrorGraphQL errorGraphQL={errorGetPosts} />;
  }
  return (
    <div className={"flex w-full flex-col items-center px-2 py-2 md:mx-0"}>
      <div className={"flex w-full max-w-2xl flex-col items-center gap-y-2"}>
        {!dataGetPosts?.getPosts || dataGetPosts?.getPosts.length === 0 ? (
          <p className={"p-2 rounded bg-red-400 italic text-sm font-semibold"}>
            There are no posts to display !
          </p>
        ) : (
          dataGetPosts.getPosts.map((post) => (
            <Post key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

export default Posts;
