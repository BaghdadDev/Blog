import React, { useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";
import { Link } from "react-router-dom";

import useOutsideClick from "../../layout/components/hooks/useOutsideClick.jsx";
import PATH from "../../config/route-path.jsx";
import OvalLoader from "../OvalLoader.jsx";
import { useDeletePost } from "../../features/post/index.jsx";

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
        <div
          className={"rounded-full p-2 hover:cursor-pointer hover:bg-slate-100"}
        >
          <SlOptions
            className={"h-4 w-4 text-slate-800"}
            data-testid={"btn-optionsPostDetails"}
            onClick={(e) => {
              setOpen((prev) => !prev);
            }}
          />
        </div>
      )}

      {open && (
        <div
          className={
            "absolute bottom-0 right-1/2 z-10 translate-y-full divide-y divide-slate-200 overflow-hidden rounded bg-slate-100 text-sm italic shadow-xl"
          }
        >
          <Link
            to={
              PATH.EDIT_POST.split(":postId")[0] +
              idPost +
              PATH.EDIT_POST.split(":postId")[1]
            }
            data-testid={"link_editPost"}
          >
            <p
              className={
                "flex items-center gap-x-2 whitespace-nowrap p-2 text-slate-800 hover:cursor-pointer hover:bg-slate-400"
              }
            >
              <AiFillEdit className={"h-6 w-6 text-slate-800"} />
              <span>Edit Post</span>
            </p>
          </Link>
          <p
            className={
              "flex items-center gap-x-2 whitespace-nowrap p-2 text-slate-800 hover:cursor-pointer hover:bg-slate-400"
            }
            onClick={handleDeletePost}
          >
            <AiFillDelete className={"h-6 w-6 text-red-800"} />
            <span>Delete Post</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default OptionsPostDetails;
