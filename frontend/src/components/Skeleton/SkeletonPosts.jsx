import React from "react";

function SkeletonPosts() {
  return (
    <div
      className={"my-2 flex w-full max-w-md animate-pulse flex-col gap-y-2"}
      data-testid={"loading-skeleton"}
    >
      <span className={"hidden"}>Loading Skeleton</span>
      <div className={"flex flex-col gap-y-2"}>
        <div className={"flex items-center gap-x-2"}>
          <div className={"h-16 w-16 rounded-full bg-gray-50"}></div>
          <div className={"h-4 w-56 rounded-full bg-gray-50"}></div>
        </div>
        <div className={"aspect-square w-full bg-gray-50"}></div>
        <div className={"h-4 w-56 self-center rounded-full bg-gray-50"}></div>
      </div>
      <div className={"flex flex-col gap-y-2"}>
        <div className={"flex items-center gap-x-2"}>
          <div className={"h-16 w-16 rounded-full bg-gray-50"}></div>
          <div className={"h-4 w-56 rounded-full bg-gray-50"}></div>
        </div>
        <div className={"aspect-square w-full bg-gray-50"}></div>
        <div className={"h-4 w-56 self-center rounded-full bg-gray-50"}></div>
      </div>
    </div>
  );
}

export default SkeletonPosts;
