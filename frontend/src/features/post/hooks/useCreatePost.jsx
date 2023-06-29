import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { CREATE_POST, GET_POSTS } from "../../../gql/post";
import apolloClient from "../../../lib/apollo-client";
import PATH from "../../../utils/route-path";

export default function useCreatePost() {
  const navigate = useNavigate();

  const [
    createPostMutation,
    { error: errorCreatePost, loading: loadingCreatePost },
  ] = useMutation(CREATE_POST, {
    onCompleted: ({ createPost }) => {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
        const posts = Array.isArray(dataCache?.getPosts)
          ? dataCache.getPosts
          : [];
        return { getPosts: [createPost, ...posts] };
      });
      navigate(PATH.ROOT);
    },
  });

  async function createPost(title, story, picture) {
    const postInput = {
      title,
      story,
      picture,
    };
    try {
      await createPostMutation({ variables: { postInput } });
    } catch (err) {}
  }

  return { createPost, errorCreatePost, loadingCreatePost };
}
