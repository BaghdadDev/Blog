import React from "react";
import { ErrorMessage } from "@hookform/error-message";
import PropTypes from "prop-types";

CustomInput.defaultProps = {
  type: "text",
  rules: {
    required: false,
  },
};

CustomInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(["text", "multiline"]),
  rules: PropTypes.object,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  className: PropTypes.string,
};

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
      {type === "multiline" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          {...register(name, rules)}
          className={"input-form"}
        ></textarea>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          {...register(name, rules)}
          className={"input-form"}
        />
      )}
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
