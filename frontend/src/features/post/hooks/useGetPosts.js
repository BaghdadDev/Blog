import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../gql/post.jsx";

export default function useGetPosts() {
  const { data, error, loading } = useQuery(GET_POSTS);

  if (loading) return { posts: null, error: null, loading: loading };
  if (error)
    if (error?.graphQLErrors[0]?.extensions?.code !== "NOT-FOUND")
      return { posts: null, error: error, loading: loading };

  return { posts: data.getPosts, error: null, loading: loading };
}
