import React from "react";

function CustomButton({ label, Icon, className }) {
  return (
    <div
      className={`group relative flex flex-col items-center py-2 hover:cursor-pointer ${className}`}
    >
      <div className={"flex items-center gap-x-4"}>
        <Icon className={"h-4 w-4"} />
        <p>{label}</p>
      </div>
      <span
        className={
          "absolute bottom-0 left-1/2 h-[2px] w-0 bg-gray-600 transition-all duration-300 group-hover:w-1/2"
        }
      ></span>
      <span
        className={
          "absolute bottom-0 left-1/2 h-[2px] w-0 bg-gray-600 transition-all duration-300 group-hover:left-0 group-hover:w-1/2"
        }
      ></span>
    </div>
  );
}

export default CustomButton;
