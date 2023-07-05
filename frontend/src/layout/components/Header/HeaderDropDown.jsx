import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserAlt, FaSignOutAlt } from "react-icons/fa";

import { useUserContext } from "../../../context/userContext.jsx";
import PATH from "../../../config/route-path.jsx";
import Avatar from "../../../components/Avatar.jsx";
import useOutsideClick from "../hooks/useOutsideClick.jsx";

function HeaderDropDown() {
  const { user, signOut } = useUserContext();
  const [open, setOpen] = useState(false);

  const ref = useOutsideClick(() => setOpen(false));

  return (
    <div
      ref={ref}
      className={"relative flex flex-col items-center justify-center"}
    >
      <Avatar
        {...user.photo}
        onClick={(e) => {
          setOpen((prev) => !prev);
        }}
      />
      {open ? (
        <div
          className={
            "absolute bottom-0 right-1/2 translate-y-full divide-y divide-gray-200 overflow-hidden rounded bg-gray-100 shadow-xl"
          }
        >
          <Link to={PATH.PROFILE}>
            <p
              className={
                "flex items-center py-2 px-4 text-gray-800 hover:cursor-pointer hover:bg-gray-400"
              }
            >
              <FaUserAlt className={"mr-4 h-4 w-4"} />
              <span>Profile</span>
            </p>
          </Link>
          <button
            className={
              "flex items-center whitespace-nowrap px-4 pt-4 pb-2 hover:cursor-pointer hover:bg-gray-400"
            }
            onClick={() => signOut()}
          >
            <FaSignOutAlt className={"mr-4 h-4 w-4"} />
            <span>Sign Out</span>
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default HeaderDropDown;
