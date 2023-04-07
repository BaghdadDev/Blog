import React from "react";

function SkeletonComments() {
  return (
    <div
      className={"mb-4 flex w-full animate-pulse flex-col gap-y-2"}
      data-testid={"loading-skeleton-comments"}
    >
      <div className={"flex items-center gap-x-2"}>
        <div className={"h-16 w-16 rounded-full bg-gray-50"}></div>
        <div className={"h-16 w-56 rounded-full bg-gray-50"}></div>
      </div>
      <div className={"flex items-center gap-x-2"}>
        <div className={"h-16 w-16 rounded-full bg-gray-50"}></div>
        <div className={"h-16 w-56 rounded-full bg-gray-50"}></div>
      </div>
    </div>
  );
}

export default SkeletonComments;
