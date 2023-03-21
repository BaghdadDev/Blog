import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";

import useOutsideClick from "../Hook/useOutsideClick.jsx";
import { DELETE_POST } from "../../gql/post.jsx";
import { Link, useNavigate } from "react-router-dom";
import PATH from "../../utils/route-path.jsx";

function OptionsPostDetails({ idPost, setLoadingDeletingPost }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const ref = useOutsideClick(() => setOpen(false));

  const [deletePost] = useMutation(DELETE_POST);

  async function handleDeletePost() {
    setLoadingDeletingPost(true);
    try {
      await deletePost({ variables: { idPost: idPost } });
      navigate(PATH.ROOT);
    } catch (errorDeletePost) {
      console.log(errorDeletePost);
    }
    setOpen((prev) => !prev);
    setLoadingDeletingPost(false);
  }

  return (
    <div
      ref={ref}
      className={"relative flex flex-col items-center justify-center"}
    >
      <SlOptions
        className={
          "h-6 w-6 cursor-pointer rounded-full p-1 text-gray-800 hover:bg-gray-100"
        }
        onClick={(e) => {
          setOpen((prev) => !prev);
        }}
      />

      {open && (
        <div
          className={
            "absolute bottom-0 right-1/2 z-10 translate-y-full divide-y divide-gray-200 overflow-hidden rounded bg-white text-sm italic shadow-xl"
          }
        >
          <p
            className={
              "flex items-center gap-x-1 p-2 hover:cursor-pointer hover:bg-gray-100"
            }
            onClick={handleDeletePost}
          >
            <AiFillDelete className={"h-4 w-4 text-red-800"} />
            <span>Delete</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default OptionsPostDetails;
