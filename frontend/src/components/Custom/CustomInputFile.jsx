import React, { useEffect, useState } from "react";
import { MdInsertPhoto } from "react-icons/md";
import { ErrorMessage } from "@hookform/error-message";
import PropTypes from "prop-types";

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
};

function CustomInputFile({ size, name, register, rules, errors, classImage }) {
  const [file, setFile] = useState(undefined);

  // async function initFile(dataURL, filename, contentType) {
  //   const data = await fetch(dataURL);
  //   const blob = await data.blob();
  //   const initFile = new File([blob], filename, { type: contentType });
  //   setFile(initFile);
  // }

  // useEffect(() => {
  //   initFile(
  //     `data:${defaultValue.contentType};base64,${defaultValue.data}`,
  //     defaultValue.filename,
  //     defaultValue.contentType
  //   );
  // }, []);

  return (
    <label htmlFor={name} className={`relative flex flex-col items-center`}>
      {!file ? (
        <MdInsertPhoto
          style={{ width: `${size}rem` }}
          className={`h-full rounded-lg text-blue-200 shadow-lg hover:text-blue-50`}
        />
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
