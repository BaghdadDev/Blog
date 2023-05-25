import React from "react";

function ErrorGraphQl({ errorGraphQL, className }) {
  console.log(errorGraphQL);
  const errorMessage =
    errorGraphQL?.graphQLErrors[0]?.message ??
    errorGraphQL?.message ??
    "Something went wrong";

  return (
    <div
      className={`rounded bg-red-300 p-2 font-semibold italic opacity-90 ${className}`}
      data-testid={"error-data"}
    >
      <p className={"text-xs"}>{errorMessage} !</p>
    </div>
  );
}

export default ErrorGraphQl;
