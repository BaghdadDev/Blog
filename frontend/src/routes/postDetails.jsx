import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import { GET_POST_BY_ID } from "../gql/post.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import Avatar from "../components/Avatar.jsx";
import TextEditor from "../components/TextEditor/index.jsx";
import SkeletonPostDetails from "../components/Skeleton/SkeletonPostDetails.jsx";

function PostDetails() {
  const { postId } = useParams();

  const {
    data: dataPost,
    loading: loadingPost,
    error: errorPost,
  } = useQuery(GET_POST_BY_ID, { variables: { idPost: postId } });

  if (loadingPost)
    return (
      <div className={"my-2 min-h-screen w-full max-w-2xl"}>
        <SkeletonPostDetails />
      </div>
    );

  if (errorPost) return <ErrorGraphQL errorGraphQL={errorPost} />;

  const post = dataPost.getPostById;

  return (
    <div className={"my-2 flex min-h-screen w-full max-w-2xl flex-col gap-y-2"}>
      <div className={"flex items-center gap-x-2"}>
        <Avatar {...post.user.photo} />
        <p className={"font-semibold"}>
          {post.user.firstName.charAt(0).toUpperCase() +
            post.user.firstName.substring(1)}{" "}
          {post.user.lastName.toUpperCase()}
        </p>
      </div>
      <img
        src={`data:${post.picture.contentType};base64,${post.picture.data}`}
        alt={post.picture.filename}
        className={"rounded"}
      />
      <p className={"text-2xl font-semibold"}>{post.title}</p>
      <TextEditor readOnly={true} initValue={post.story} />
    </div>
  );
}

export default PostDetails;
