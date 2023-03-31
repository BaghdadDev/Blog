import React, { useEffect } from "react";
import { Node } from "slate";

import Avatar from "../Avatar.jsx";
import PATH from "../../utils/route-path.jsx";
import { Link } from "react-router-dom";
import {
  DELETED_POST_SUB,
  TOGGLED_LIKE_POST_SUB,
  UPDATED_POST_SUB,
} from "../../gql/post.jsx";
import {
  CREATED_COMMENT_SUB,
  DELETED_COMMENT_SUB,
} from "../../gql/comment.jsx";

function Post({ post, subscribeToGetPosts }) {
  function storyToString(value) {
    return JSON.parse(value)
      .map((n) => Node.string(n))
      .join(" ");
  }

  function subscribeToDeletedPost() {
    subscribeToGetPosts({
      document: DELETED_POST_SUB,
      variables: { idPost: post._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const idDeletedPost = subscriptionData.data.deletedPost;
        const filteredPosts = prev.getPosts.filter(
          (post) => post._id !== idDeletedPost
        );
        return Object.assign({}, prev, {
          getPosts: filteredPosts,
        });
      },
    });
  }

  function subscribeToToggledLikePost() {
    subscribeToGetPosts({
      document: TOGGLED_LIKE_POST_SUB,
      variables: { idPost: post._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { _id: idUserToggledLikePost } =
          subscriptionData.data.toggledLikePost;
        const indexPost = prev.getPosts.findIndex(
          ({ _id }) => _id === post._id
        );
        const copyLikes = Array.isArray(prev.getPosts[indexPost].likes)
          ? [...prev.getPosts[indexPost].likes]
          : [];
        if (
          prev.getPosts[indexPost].likes.find(
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
        let copyPosts = [...prev.getPosts];
        copyPosts[indexPost] = { ...copyPosts[indexPost], likes: copyLikes };
        return Object.assign({}, prev, {
          getPosts: copyPosts,
        });
      },
    });
  }

  function subscribeToUpdatedPost() {
    subscribeToGetPosts({
      document: UPDATED_POST_SUB,
      variables: { idPost: post._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const postUpdated = subscriptionData.data.updatedPost;
        const indexPost = prev.getPosts.findIndex(
          ({ _id }) => _id === postUpdated._id
        );
        let copyPosts = [...prev.getPosts];
        copyPosts[indexPost] = postUpdated;
        return Object.assign({}, prev, {
          getPosts: copyPosts,
        });
      },
    });
  }

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

  useEffect(() => {
    subscribeToDeletedPost();
    subscribeToToggledLikePost();
    subscribeToUpdatedPost();
    subscribeToCreatedComment();
    subscribeToDeletedComment();
  }, []);

  return (
    <div
      className={
        "relative flex w-full flex-col overflow-hidden rounded bg-white"
      }
    >
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
        />
      </Link>
      <p className={"pl-2 font-semibold"}>{post.title}</p>
      <p className={"w-full truncate px-2"}>{storyToString(post.story)}</p>
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
