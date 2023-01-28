import React from "react";
import PropTypes from "prop-types";

/*
 *** This component is compatible with "react-form-hook",
 * You have to provide either "register" and "name" for uncontrolled component, or "field" for controlled component
 */

function CustomInput({
  type,
  placeholder,
  defaultValue,
  inputProps,
  rules,
  className,
}) {
  return (
    <div className={`flex grow items-center ${className}`}>
      {inputProps ? (
        inputProps.field ? (
          <input
            placeholder={placeholder}
            {...inputProps.field}
            type={type}
            defaultValue={defaultValue}
            className={`w-full rounded bg-gray-200 px-2 py-1 text-center outline-none placeholder:text-sm placeholder:italic`}
          />
        ) : (
          <input
            placeholder={placeholder}
            {...inputProps.register(inputProps.name)}
            type={type ? type : "text"}
            defaultValue={defaultValue}
            className={`w-full rounded bg-gray-200 px-2 py-1 text-center outline-none placeholder:text-sm placeholder:italic`}
          />
        )
      ) : (
        "inputProps was not be provided"
      )}
    </div>
  );
}

export default CustomInput;

CustomInput.propTypes = {
  type: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  rules: PropTypes.object,
  inputProps: PropTypes.object.isRequired,
};

CustomInput.defaultProps = {
  type: "text",
  defaultValue: "",
  placeholder: "",
};
