import React from "react";

function SkeletonPostDetails() {
  return (
    <div className={"mb-4 flex w-full animate-pulse flex-col gap-y-2"}>
      <div className={"flex items-center gap-x-2"}>
        <div className={"h-16 w-16 rounded-full bg-gray-50"}></div>
        <div className={"h-4 w-56 rounded-full bg-gray-50"}></div>
      </div>
      <div className={"aspect-square w-full rounded bg-gray-50"}></div>
      <div className={"h-4 w-56 rounded-full bg-gray-50"}></div>
      <div className={"flex w-full flex-col gap-y-1"}>
        <span className={"h-2 w-full rounded bg-gray-50"}></span>
        <span className={"h-2 w-full rounded bg-gray-50"}></span>
        <span className={"h-2 w-full rounded bg-gray-50"}></span>
      </div>
    </div>
  );
}

export default SkeletonPostDetails;
