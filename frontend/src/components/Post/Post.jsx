import React, { useEffect } from "react";
import { Node } from "slate";
import { Link, useNavigate } from "react-router-dom";

import Avatar from "../Avatar.jsx";
import PATH from "../../utils/route-path.jsx";
import {
  DELETED_POST_SUB,
  GET_POSTS,
  TOGGLED_LIKE_POST_SUB,
  UPDATED_POST_SUB,
} from "../../gql/post.jsx";
import {
  CREATED_COMMENT_SUB,
  DELETED_COMMENT_SUB,
} from "../../gql/comment.jsx";
import { useSubscription } from "@apollo/client";
import apolloClient from "../../config/apollo-client.jsx";

function Post({ post, subscribeToGetPosts }) {
  const navigate = useNavigate();

  const { data: dataSubDeletedPost, error: errorSubDeletedPost } =
    useSubscription(DELETED_POST_SUB, { variables: { idPost: post._id } });

  const { data: dataSubToggledLikePost, error: errorSubToggledLikePost } =
    useSubscription(TOGGLED_LIKE_POST_SUB, { variables: { idPost: post._id } });

  const { data: dataSubUpdatedPost, error: errorSubUpdatedPost } =
    useSubscription(UPDATED_POST_SUB, { variables: { idPost: post._id } });

  useEffect(() => {
    if (dataSubDeletedPost && !errorSubDeletedPost) {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
        const updatedPosts = dataCache.getPosts.filter(
          (post) => post._id !== dataSubDeletedPost.deletedPost._id
        );
        return {
          getPosts: updatedPosts,
        };
      });
    }
  }, [dataSubDeletedPost, errorSubDeletedPost]);

  useEffect(() => {
    if (dataSubToggledLikePost && !errorSubToggledLikePost) {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
        const idUserToggledLikePost =
          dataSubToggledLikePost.toggledLikePost._id;
        const indexPost = dataCache.getPosts.findIndex(
          ({ _id }) => _id === post._id
        );
        const copyLikes = Array.isArray(dataCache.getPosts[indexPost]?.likes)
          ? [...dataCache.getPosts[indexPost].likes]
          : [];
        if (
          dataCache.getPosts[indexPost].likes.find(
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
        console.log(copyLikes);
        let copyPosts = [...dataCache.getPosts];
        copyPosts[indexPost] = { ...copyPosts[indexPost], likes: copyLikes };
        return {
          getPosts: copyPosts,
        };
      });
    }
  }, [dataSubToggledLikePost, errorSubToggledLikePost]);

  useEffect(() => {
    if (dataSubUpdatedPost && !errorSubUpdatedPost) {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
        const postUpdated = dataSubUpdatedPost.data.updatedPost;
        const indexPost = dataCache.getPosts.findIndex(
          ({ _id }) => _id === postUpdated._id
        );
        let copyPosts = [...dataCache.getPosts];
        copyPosts[indexPost] = postUpdated;
        return {
          getPosts: copyPosts,
        };
      });
    }
  }, [dataSubUpdatedPost, errorSubUpdatedPost]);

  function subscribeToCreatedComment() {
    subscribeToGetPosts({
      document: CREATED_COMMENT_SUB,
      variables: { idPost: post._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const createdComment = subscriptionData.data.createdComment;
        const indexPost = prev.getPosts.findIndex(
          ({ _id }) => _id === createdComment.post._id
        );
        const copyComments = Array.isArray(prev.getPosts[indexPost].comments)
          ? [...prev.getPosts[indexPost].comments]
          : [];
        copyComments.push({
          __typename: createdComment.__typename,
          _id: createdComment._id,
        });
        let copyPosts = [...prev.getPosts];
        copyPosts[indexPost] = {
          ...prev.getPosts[indexPost],
          comments: copyComments,
        };
        return Object.assign({}, prev, {
          getPosts: copyPosts,
        });
      },
    });
  }

  function subscribeToDeletedComment() {
    subscribeToGetPosts({
      document: DELETED_COMMENT_SUB,
      variables: { idPost: post._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const idDeletedComment = subscriptionData.data.createdComment;
        const indexPost = prev.getPosts.findIndex(
          ({ _id }) => _id === post._id
        );
        const copyComments = [...prev.getPosts[indexPost].comments];
        copyComments.splice(
          copyComments.findIndex((comment) => comment._id === idDeletedComment),
          1
        );
        let copyPosts = [...prev.getPosts];
        copyPosts[indexPost] = {
          ...prev.getPosts[indexPost],
          comments: copyComments,
        };
        return Object.assign({}, prev, {
          getPosts: copyPosts,
        });
      },
    });
  }

  // useEffect(() => {
  //   subscribeToDeletedPost();
  //   subscribeToToggledLikePost();
  //   subscribeToUpdatedPost();
  //   subscribeToCreatedComment();
  //   subscribeToDeletedComment();
  // }, []);

  return (
    <div
      className={
        "relative flex w-full flex-col overflow-hidden rounded bg-white"
      }
      data-testid={`post-test-${post._id}`}
    >
      <p className={"hidden"}>{post._id}</p>
      <div className={"my-1 flex items-center gap-x-2 pl-2"}>
        <Avatar {...post.user.photo} />
        <p className={"font-semibold"}>
          {post.user.firstName.charAt(0).toUpperCase() +
            post.user.firstName.substring(1)}{" "}
          {post.user.lastName.toUpperCase()}
        </p>
      </div>
      <Link to={PATH.POST_DETAILS.split(":")[0] + `${post._id}`}>
        <img
          src={`data:${post.picture.contentType};base64,${post.picture.data}`}
          alt={post.picture.filename}
          className={"w-full hover:cursor-pointer"}
          onClick={() =>
            navigate(PATH.POST_DETAILS.split(":")[0] + `${post._id}`)
          }
          aria-label={`post-img`}
        />
      </Link>
      <p className={"pl-2 font-semibold"}>{post.title}</p>
      <p className={"w-full truncate px-2"}>
        {JSON.parse(post.story)
          .map((n) => Node.string(n))
          .join(" ")}
      </p>
      <div
        className={
          "flex w-full select-none items-center justify-end gap-x-2 px-2 italic "
        }
      >
        <p className={"flex items-center gap-x-1"}>
          <span>{post.likes.length}</span>
          <span>Likes</span>
        </p>
        <p className={"flex items-center gap-x-1"}>
          <span>{post.comments.length}</span>
          <span>Comments</span>
        </p>
      </div>
    </div>
  );
}

export default Post;
