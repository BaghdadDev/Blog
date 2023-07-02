import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import {
  GET_POST_BY_ID,
  UPDATE_POST_PICTURE,
  UPDATE_POST_TEXT,
} from "../../../gql/post";
import apolloClient from "../../../lib/apollo-client";
import PATH from "../../../utils/route-path";

export default function useUpdatePost(idPost) {
  const navigate = useNavigate();

  const [
    updatePostPictureMutation,
    { loading: loadingUpdatePostPicture, error: errorUpdatePostPicture },
  ] = useMutation(UPDATE_POST_PICTURE, {
    onCompleted: (res) => {
      apolloClient.cache.updateQuery(
        { query: GET_POST_BY_ID, variables: { idPost } },
        (dataCache) => {
          return {
            getPostById: {
              ...dataCache.getPostById,
              picture: res.updatePostPicture,
            },
          };
        }
      );
    },
  });

  const [
    updatePostTextMutation,
    { loading: loadingUpdatePostText, error: errorUpdatePostText },
  ] = useMutation(UPDATE_POST_TEXT, {
    onCompleted: (res) => {
      apolloClient.cache.updateQuery(
        { query: GET_POST_BY_ID, variables: { idPost } },
        (dataCache) => {
          return { getPostById: res.updatePostText };
        }
      );
      navigate(PATH.POST_DETAILS.split(":postId")[0] + idPost);
    },
  });

  async function updatePostPicture(picture) {
    try {
      await updatePostPictureMutation({
        variables: { idPost, picture },
      });
    } catch (errorUpdatePostPicture) {
      console.log(errorUpdatePostPicture);
    }
  }

  async function updatePostText(title, story) {
    const postInput = {
      title: title,
      story: story,
    };
    try {
      await updatePostTextMutation({
        variables: { idPost, postInput },
      });
    } catch (errorSubmittingUpdatePost) {
      console.log(errorSubmittingUpdatePost);
    }
  }
  return {
    updatePostPicture,
    updatePostText,
    loadingUpdatePostPicture,
    loadingUpdatePostText,
    errorUpdatePostPicture,
    errorUpdatePostText,
  };
}
