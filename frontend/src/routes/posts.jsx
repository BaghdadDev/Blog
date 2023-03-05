import React, { useEffect } from "react";
import ErrorGraphQL from "../components/ErrorGraphQL";
import { GET_POSTS, POSTS_SUBSCRIPTION } from "../gql/post.jsx";
import Post from "../components/Post.jsx";
import { useQuery, useSubscription } from "@apollo/client";
import SkeletonPosts from "../components/Skeleton/SkeletonPosts.jsx";

function Posts() {
  const {
    subscribeToMore,
    data: dataGetPosts,
    error: errorGetPosts,
    loading: loadingGetPosts,
  } = useQuery(GET_POSTS);

  // const { data: dataPostCreated, loading: loadingPostCreated } =
  //   useSubscription(POSTS_SUBSCRIPTION);

  function handleSubscribeToPosts() {
    subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newFeedItem = subscriptionData.data.postCreated;

        return Object.assign({}, prev, {
          getPosts: {
            comments: [newFeedItem, ...prev.getPosts],
          },
        });
      },
    });
  }

  useEffect(() => {
    handleSubscribeToPosts();
  }, []);

  if (loadingGetPosts) return <SkeletonPosts />;

  if (errorGetPosts) return <ErrorGraphQL errorGraphQL={errorGetPosts} />;

  return (
    <div className={"flex w-full flex-col items-center px-2 py-2 md:mx-0"}>
      <div className={"flex w-full max-w-2xl flex-col items-center gap-y-2"}>
        {/*<h2>{!loadingPostCreated && dataPostCreated.postCreated.title}</h2>*/}
        {dataGetPosts.getPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Posts;
