import React from "react";
import { Node } from "slate";
import { Link } from "react-router-dom";

import { useSubscription } from "@apollo/client";
import apolloClient from "../../config/apollo-client.jsx";
import {
  CREATED_COMMENT_SUB,
  DELETED_COMMENT_SUB,
} from "../../gql/comment.jsx";
import {
  DELETED_POST_SUB,
  GET_POSTS,
  TOGGLED_LIKE_POST_SUB,
  UPDATED_POST_SUB,
} from "../../gql/post.jsx";
import PATH from "../../utils/route-path.jsx";
import Avatar from "../Avatar.jsx";
import {
  subDeletePost,
  subUpdatePost,
  subToggleLikePost,
  subCreateComment,
} from "../../features/subscriptions";

function Post({ post }) {
  subDeletePost(post._id);
  subUpdatePost(post._id);
  subToggleLikePost(post._id);
  subCreateComment(post._id);

  useSubscription(DELETED_COMMENT_SUB, {
    variables: { idPost: post._id },
    onData: ({
      data: {
        data: { deletedComment },
      },
    }) => {
      apolloClient.cache.updateQuery({ query: GET_POSTS }, (dataCache) => {
        const idDeletedComment = deletedComment._id;
        const indexPost = dataCache.getPosts.findIndex(
          ({ _id }) => _id === post._id
        );
        const copyComments = [...dataCache.getPosts[indexPost].comments];
        copyComments.splice(
          copyComments.findIndex((comment) => comment._id === idDeletedComment),
          1
        );
        let copyPosts = [...dataCache.getPosts];
        copyPosts[indexPost] = {
          ...dataCache.getPosts[indexPost],
          comments: copyComments,
        };
        return {
          getPosts: copyPosts,
        };
      });
    },
  });

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
          aria-label={`post-img`}
          data-testid={`post-img-link-${post._id}`}
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
