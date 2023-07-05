import React from "react";

import OvalLoader from "../../../components/OvalLoader.jsx";
import ErrorGraphQL from "../../../components/ErrorGraphQL.jsx";
import { Node } from "slate";
import { Link } from "react-router-dom";
import PATH from "../../../config/route-path.jsx";

function SearchResult({
  loadingSearchPosts,
  errorSearchPosts,
  dataSearchPosts,
}) {
  function storyToString(value) {
    return JSON.parse(value)
      .map((n) => Node.string(n))
      .join(" ");
  }

  return (
    <div
      className={
        "absolute bottom-0 left-0 right-0 translate-y-[calc(100%_+_5px)] overflow-hidden rounded bg-gray-100 shadow-lg"
      }
    >
      {loadingSearchPosts ? (
        <div className={"flex w-full items-center justify-center p-2"}>
          <OvalLoader />
        </div>
      ) : errorSearchPosts ? (
        <div className={"flex w-full items-center justify-center p-2"}>
          <ErrorGraphQL errorGraphQL={errorSearchPosts} />
        </div>
      ) : (
        dataSearchPosts?.searchPosts.map((post) => (
          <Link
            to={PATH.POST_DETAILS.split(":")[0] + `${post._id}`}
            key={post._id}
          >
            <div
              className={
                "flex w-full items-center gap-x-2 overflow-hidden p-2 hover:cursor-pointer hover:bg-gray-200"
              }
            >
              <img
                src={`data:${post.picture.contentType};base64,${post.picture.data}`}
                alt={post.picture.filename}
                className={"w-2/12"}
              />
              <div className={"flex w-full flex-col"}>
                <p className={"font-semibold line-clamp-1"}>{post.title}</p>
                <p className={"w-full text-xs line-clamp-1"}>
                  {storyToString(post.story)}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default SearchResult;
