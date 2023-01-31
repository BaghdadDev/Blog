import React from "react";
import { ErrorMessage } from "@hookform/error-message";

function CustomInput({
  name,
  placeholder,
  type,
  register,
  rules,
  errors,
  className,
}) {
  return (
    <div className={`relative flex w-full flex-col items-center ${className}`}>
      <input
        type={type ? type : "text"}
        placeholder={placeholder}
        name={name}
        {...register(name, rules ? rules : { required: false })}
        className={"input-form"}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p
            className={
              "absolute bottom-0 translate-y-[calc(100%_+_2px)] rounded bg-red-300 p-1 text-sm italic opacity-90"
            }
          >
            {message}
          </p>
        )}
      />
    </div>
  );
}

export default CustomInput;
