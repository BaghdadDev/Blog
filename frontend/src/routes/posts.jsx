import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { SINGLE_UPLOAD } from "../gql/upload.jsx";

function Posts(props) {
  const { register, handleSubmit } = useForm();

  const [file, setFile] = useState(undefined);

  const [singleUpload, { loading, error }] = useMutation(SINGLE_UPLOAD);

  async function handleUpload(data) {
    try {
      console.log(data.files[0]);
      const res = await singleUpload({
        variables: { file: data.files[0] },
      });
      console.log(res.data);
      setFile(res.data.singleUpload);
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  }

  return (
    <div className={"flex w-full flex-col items-center"}>
      <form
        onSubmit={handleSubmit(handleUpload)}
        className={"flex flex-col items-center gap-10"}
      >
        <input type={"file"} {...register("files")} />
        <button type={"submit"} className={"btn-form"}>
          Upload
        </button>
        {loading && "Loading..."}
        {file && (
          <img
            className={"w-[200px]"}
            src={`data:${file.contentType};base64,${file.data}`}
            alt={"img"}
          />
        )}
      </form>
    </div>
  );
}

export default Posts;
