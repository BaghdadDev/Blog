import React from "react";

function Toolbar({ children }) {
  return (
    <div
      className={
        "flex flex-wrap items-center gap-2 rounded-full bg-gray-50 p-1 "
      }
    >
      {children}
    </div>
  );
}

export default Toolbar;
