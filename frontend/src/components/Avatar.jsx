import React from "react";

function Avatar({ contentType, data, filename, size, onClick }) {
  return (
    <img
      src={`data:${contentType};base64,${data}`}
      alt={filename}
      className={`aspect-square rounded-full w-${
        size ? String(size) : "10"
      } border-2 border-gray-200 ${
        onClick && "hover:cursor-pointer hover:brightness-50"
      }`}
      onClick={onClick}
    />
  );
}

export default Avatar;
