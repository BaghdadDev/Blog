import React, { useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";
import { Link } from "react-router-dom";

import useOutsideClick from "../../../layout/components/hooks/useOutsideClick.jsx";
import PATH from "../../../utils/route-path.jsx";
import OvalLoader from "../../OvalLoader.jsx";
import { useDeletePost } from "../../../features/post/index.jsx";

function OptionsPostDetails({ idPost }) {
  const [open, setOpen] = useState(false);

  const ref = useOutsideClick(() => setOpen(false));

  const { deletePost, loadingDeletePost } = useDeletePost();

  function handleDeletePost() {
    setOpen((prev) => !prev);
    deletePost(idPost);
  }

  return (
    <div
      ref={ref}
      className={"relative flex flex-col items-center justify-center"}
    >
      {loadingDeletePost ? (
        <OvalLoader />
      ) : (
        <SlOptions
          className={
            "h-6 w-6 cursor-pointer rounded-full p-1 text-gray-800 hover:bg-gray-100"
          }
          data-testid={"btn-optionsPostDetails"}
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
          <Link
            to={
              PATH.EDIT_POST.split(":postId")[0] +
              idPost +
              PATH.EDIT_POST.split(":postId")[1]
            }
          >
            <p
              className={
                "flex items-center gap-x-1 p-2 hover:cursor-pointer hover:bg-gray-100"
              }
            >
              <AiFillEdit className={"h-4 w-4 text-red-800"} />
              <span>Edit Post</span>
            </p>
          </Link>
          <p
            className={
              "flex items-center gap-x-1 p-2 hover:cursor-pointer hover:bg-gray-100"
            }
            onClick={handleDeletePost}
          >
            <AiFillDelete className={"h-4 w-4 text-red-800"} />
            <span>Delete Post</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default OptionsPostDetails;
