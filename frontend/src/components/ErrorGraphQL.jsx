import React from "react";

function ErrorGraphQl({ errorGraphQL, className }) {
  return errorGraphQL.graphQLErrors.map(({ message, extensions }, i) => (
    <div
      key={message}
      className={`absolute top-0 -translate-y-[calc(100%_+_2px)] rounded bg-red-300 p-2 font-semibold italic opacity-90 ${className}`}
    >
      {/*<p className={"text-sm font-semibold italic"}>{extensions.code}</p>*/}
      <p className={"text-xs"}>{message} !</p>
    </div>
  ));
}

export default ErrorGraphQl;
