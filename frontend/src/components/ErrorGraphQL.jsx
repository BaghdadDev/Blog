import React from "react";

function ErrorGraphQl({ errorGraphQL, className }) {
  const errorMessage =
    errorGraphQL.graphQLErrors[0]?.message ??
    errorGraphQL.message ??
    "Something went wrong";

  return (
    <div
      className={`absolute top-0 -translate-y-[calc(100%_+_2px)] rounded bg-red-300 p-2 font-semibold italic opacity-90 ${className}`}
    >
      <p className={"text-xs"}>{errorMessage} !</p>
    </div>
  );
}

export default ErrorGraphQl;
