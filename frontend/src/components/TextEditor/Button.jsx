import React from "react";

function Button({ active, onMouseDown, Icon }) {
  return (
    <Icon
      onMouseDown={onMouseDown}
      className={`h-6 w-6 rounded-full p-1 opacity-50 hover:cursor-pointer ${
        active ? "bg-gray-800 text-white" : "text-black"
      }`}
    />
  );
}

export default Button;
