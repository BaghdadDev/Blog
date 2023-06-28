import React from "react";
import { useQuery } from "@apollo/client";

import { GET_COMMENTS } from "../../../gql/comment.jsx";

function useGetComments(idPost) {
  const { data, loading, error } = useQuery(GET_COMMENTS, {
    variables: { idPost },
  });

  if (loading) return { comments: null, error: null, loading: loading };
  if (error)
    if (error.graphQLErrors[0]?.extensions?.code !== "NOT-FOUND")
      return { comments: null, error: error, loading: loading };

  return {
    comments: data?.getComments ? data.getComments : [],
    error: null,
    loading: null,
  };
}

export default useGetComments;
