import React, { useEffect, useState } from "react";
import { MdInsertPhoto } from "react-icons/md";
import { ErrorMessage } from "@hookform/error-message";
import PropTypes from "prop-types";
// import base64toFile from "node-base64-to-file";

CustomInputFile.defaultProps = {
  size: 2,
};

CustomInputFile.propTypes = {
  size: PropTypes.number,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  rules: PropTypes.object,
  errors: PropTypes.object.isRequired,
  className: PropTypes.string,
  defaultValue: PropTypes.object,
};

function CustomInputFile({
  size,
  name,
  register,
  rules,
  errors,
  classImage,
  defaultValue,
}) {
  const [file, setFile] = useState(undefined);

  // async function base64StringToFile() {
  //   if (!defaultValue) return undefined;
  //   const base64String = `data:${defaultValue.contentType};base64,${defaultValue.data}`;
  //   console.log(await base64toFile(base64String));
  //   return await base64toFile(base64String);
  // }
  //
  // useEffect(() => {
  //   base64StringToFile();
  // }, []);

  return (
    <label htmlFor={name} className={`relative flex flex-col items-center`}>
      {!file ? (
        !defaultValue ? (
          <MdInsertPhoto
            style={{ width: `${size}rem` }}
            className={`h-full rounded-lg text-blue-200 shadow-lg hover:text-blue-50`}
          />
        ) : (
          <img
            src={`data:${defaultValue.contentType};base64,${defaultValue.data}`}
            alt={defaultValue.filename}
            className={`w-3/4 rounded border-2 border-gray-200 hover:cursor-pointer hover:brightness-50 md:w-1/2 ${classImage}`}
          />
        )
      ) : (
        <img
          src={URL.createObjectURL(file)}
          alt={file.filename}
          className={`w-3/4 rounded border-2 border-gray-200 hover:cursor-pointer hover:brightness-50 md:w-1/2 ${classImage}`}
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
      <input
        id={name}
        type={"file"}
        accept={"image/*"}
        {...register(
          name,
          rules
            ? {
                ...rules,
                onChange: ({
                  nativeEvent: {
                    target: { validity, files },
                  },
                }) => {
                  if (validity.valid && files && files[0]) setFile(files[0]);
                },
              }
            : { required: false }
        )}
        className={"hidden"}
      />
    </label>
  );
}

export default CustomInputFile;
