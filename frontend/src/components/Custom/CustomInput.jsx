import React from "react";

function CustomInput({ name, placeholder, type, error, className }) {
  return (
    <div className={`relative w-full flex flex-col items-center ${className}`}>
      <input
        type={type ? type : "text"}
        placeholder={placeholder}
        name={name}
        className={"input-form"}
      />
      {error && (
        <p
          className={
            "absolute bottom-0 bg-red-300 italic translate-y-[calc(100%_+_2px)] text-sm p-1 rounded"
          }
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default CustomInput;
