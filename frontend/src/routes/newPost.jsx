import React, { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import CustomButton from "../components/Custom/CustomButton.jsx";
import CustomInput from "../components/Custom/CustomInput.jsx";
import { useForm } from "react-hook-form";

function NewPost() {
  const [file, setFile] = useState(undefined);
  const { register, handleSubmit } = useForm();

  return (
    <form>
      <h1>New Post</h1>
      {!file ? <CiImageOn className={""} /> : <img src={""} alt={""} />}
      <CustomInput name={"title"} placeholder={"Title"} register={register} />
    </form>
  );
}

export default NewPost;
