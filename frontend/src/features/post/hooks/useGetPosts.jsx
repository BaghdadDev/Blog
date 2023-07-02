import { NetworkStatus, useQuery } from "@apollo/client";

import { GET_POSTS } from "../../../gql/post.jsx";
import { useEffect } from "react";

export default function useGetPosts() {
  const { data, error, loading, refetch } = useQuery(GET_POSTS, {
    pollInterval: 1000 * 60,
  });

  if (loading) return { posts: null, error: null, loading, refetch: null };
  if (error)
    if (error?.graphQLErrors[0]?.extensions?.code !== "NOT-FOUND")
      return { posts: null, error: error, loading, refetch: null };

  return {
    posts: data?.getPosts ? data.getPosts : [],
    error: null,
    loading,
    refetch,
  };
}
