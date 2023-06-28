import React from "react";

import { GET_COMMENTS } from "../../gql/comment.jsx";
import Comment from "./components/Comment.jsx";
import ErrorGraphQL from "../ErrorGraphQL";
import SkeletonComments from "../Skeleton/SkeletonComments.jsx";
import useGetComments from "../../features/comment/hooks/useGetComments.jsx";
import {
  subCreateComment,
  subDeleteComment,
} from "../../features/subscriptions/index.jsx";
import CreateComment from "./components/CreateComment.jsx";

function IndexComments({ idPost }) {
  const {
    comments,
    error: errorComments,
    loading: loadingComments,
  } = useGetComments(idPost);

  subCreateComment(idPost, "GET_COMMENTS");
  subDeleteComment(idPost, "GET_COMMENTS");

  if (loadingComments)
    return (
      <div className={"w-ful flex items-center justify-center"}>
        <SkeletonComments />
      </div>
    );

  if (errorComments) {
    return (
      <div className={"w-ful flex items-center justify-center"}>
        <ErrorGraphQL errorGraphQL={errorComments} />
      </div>
    );
  }

  return (
    <div
      className={
        "mb-16 flex w-full flex-col items-center justify-center px-2 text-xs md:text-sm"
      }
    >
      <CreateComment idPost={idPost} />
      <div className={"w-3/4"}>
        {comments?.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default IndexComments;
