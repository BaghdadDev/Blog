import { useQuery } from "@apollo/client";

import { GET_POST_BY_ID } from "../../../gql/post.jsx";

export default function useGetPostById(idPost) {
  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    variables: { idPost },
  });

  if (loading) return { post: null, error: null, loading: loading };
  if (error) return { post: null, error: error, loading: loading };
  return { post: data.getPostById, error: null, loading: loading };
}
