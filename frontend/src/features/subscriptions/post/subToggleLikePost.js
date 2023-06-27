import { useSubscription } from "@apollo/client";

import apolloClient from "../../../config/apollo-client";
import { GET_POSTS, TOGGLED_LIKE_POST_SUB } from "../../../gql/post";

export default function subToggleLikePost(idPost) {
  useSubscription(TOGGLED_LIKE_POST_SUB, {
    variables: { idPost },
    onData: ({
      data: {
        data: { toggledLikePost },
      },
    }) => {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
        const idUserToggledLikePost = toggledLikePost._id;
        const indexPost = dataCache.getPosts.findIndex(
          ({ _id }) => _id === post._id
        );
        const copyLikes = Array.isArray(dataCache.getPosts[indexPost]?.likes)
          ? [...dataCache.getPosts[indexPost].likes]
          : [];
        if (
          dataCache.getPosts[indexPost]?.likes.find(
            (like) => like._id === idUserToggledLikePost
          )
        ) {
          copyLikes.splice(
            copyLikes.findIndex((like) => like._id === idUserToggledLikePost),
            1
          );
        } else {
          copyLikes.push({ __typename: "User", _id: idUserToggledLikePost });
        }
        let copyPosts = [...dataCache.getPosts];
        copyPosts[indexPost] = { ...copyPosts[indexPost], likes: copyLikes };
        return {
          getPosts: copyPosts,
        };
      });
    },
  });
  return undefined;
}
