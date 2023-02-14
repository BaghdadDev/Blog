import React, { useEffect, useState } from "react";
import { MdInsertPhoto } from "react-icons/md";
import { ErrorMessage } from "@hookform/error-message";

function CustomInputFile({ name, register, rules, errors }) {
  const [file, setFile] = useState(undefined);

  return (
    <label
      htmlFor={name}
      className={"relative flex w-full flex-col items-center"}
    >
      {!file ? (
        <MdInsertPhoto
          className={
            "h-10 w-10 rounded-full p-1 text-blue-200 transition duration-100 hover:cursor-pointer hover:bg-gray-300 hover:text-blue-400"
          }
        />
      ) : (
        <img
          src={URL.createObjectURL(file)}
          alt={file.filename}
          className={
            "h-20 w-20 rounded-full border-2 border-gray-200 transition duration-100 hover:cursor-pointer hover:brightness-50"
          }
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
