import React, { useState } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";

import useOutsideClick from "../Hook/useOutsideClick.jsx";
import { DELETE_COMMENT } from "../../gql/comment.jsx";
import { useMutation } from "@apollo/client";
import { GET_POST_BY_ID } from "../../gql/post.jsx";
import OvalLoader from "../OvalLoader.jsx";

function OptionsComment({ idComment, idPost }) {
  const [open, setOpen] = useState(false);

  const ref = useOutsideClick(() => setOpen(false));

  const [deleteComment, { loading: loadingDeleteComment }] = useMutation(
    DELETE_COMMENT,
    {
      refetchQueries: [
        { query: GET_POST_BY_ID, variables: { idPost: idPost } },
      ],
    }
  );

  async function handleDeleteComment() {
    try {
      await deleteComment({ variables: { idComment: idComment } });
    } catch (errorDeleteComment) {
      console.log(errorDeleteComment);
    }
    setOpen((prev) => !prev);
  }

  return (
    <div
      ref={ref}
      className={"relative flex flex-col items-center justify-center"}
    >
      {loadingDeleteComment ? (
        <OvalLoader />
      ) : (
        <SlOptions
          className={
            "h-6 w-6 cursor-pointer rounded-full p-1 text-gray-800 hover:bg-gray-100"
          }
          onClick={(e) => {
            setOpen((prev) => !prev);
          }}
        />
      )}

      {open && (
        <div
          className={
            "absolute bottom-0 right-1/2 z-10 translate-y-full divide-y divide-gray-200 overflow-hidden rounded bg-white text-sm italic shadow-xl"
          }
        >
          <p
            className={
              "flex items-center gap-x-1 p-1 hover:cursor-pointer hover:bg-gray-100"
            }
          >
            <AiFillEdit className={"h-4 w-4 text-blue-800"} />
            <span>Edit</span>
          </p>
          <p
            className={
              "flex items-center gap-x-1 p-1 hover:cursor-pointer hover:bg-gray-100"
            }
            onClick={handleDeleteComment}
          >
            <AiFillDelete className={"h-4 w-4 text-red-800"} />
            <span>Delete</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default OptionsComment;
