import React from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { DELETE_POST, GET_POSTS } from "../../../gql/post.jsx";
import apolloClient from "../../../lib/apollo-client.jsx";
import PATH from "../../../config/route-path.jsx";

export default function useDeletePost() {
  const navigate = useNavigate();

  const [deletePostMutation, { loading: loadingDeletePost }] = useMutation(
    DELETE_POST,
    {
      onCompleted: ({ deletePost: idDeletedPost }) => {
        apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
          const posts = Array.isArray(dataCache?.getPosts)
            ? dataCache.getPosts
            : [];
          const filteredPosts = posts.filter(
            (post) => post._id !== idDeletedPost
          );
          return { getPosts: filteredPosts };
        });
        navigate(PATH.ROOT);
      },
    }
  );

  async function deletePost(idPost) {
    try {
      await deletePostMutation({ variables: { idPost } });
    } catch (errorDeletePost) {
      console.log(errorDeletePost);
    }
  }
  return { deletePost, loadingDeletePost };
}
