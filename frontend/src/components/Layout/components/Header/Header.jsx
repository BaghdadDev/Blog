import React from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { FaSignInAlt, FaPenFancy } from "react-icons/fa";

import PATH from "../../../../utils/route-path.jsx";
import HeaderDropDown from "./HeaderDropDown.jsx";
import { useUserContext } from "../../../../context/userContext.jsx";
import CustomButton from "../../../Custom/CustomButton.jsx";
import Search from "../Search/Search.jsx";

function Header() {
  const { user } = useUserContext();

  const location = useLocation();

  return (
    <header
      className={
        "sticky top-0 left-0 z-20 flex h-16 w-full items-center justify-between bg-white px-2 py-4 text-sm shadow-lg"
      }
    >
      <Link to={PATH.ROOT}>Blog Logo</Link>
      {user ? <Search /> : undefined}
      {!user ? (
        location.pathname !== PATH.SIGN_IN &&
        location.pathname !== PATH.SIGN_UP ? (
          <div>
            <Link to={PATH.SIGN_IN}>
              <CustomButton label={"Sign In"} Icon={FaSignInAlt} />
            </Link>
          </div>
        ) : undefined
      ) : (
        <div className={"flex items-center"}>
          <NavLink
            to={PATH.NEW_POST}
            className={({ isActive }) =>
              isActive ? "pointer-events-none rounded bg-gray-200" : ""
            }
          >
            <CustomButton
              label={"Write a Post"}
              Icon={FaPenFancy}
              className={"italic"}
            />
          </NavLink>
          <div
            className={
              "ml-4 flex items-center gap-x-2 border-l-2 border-gray-600 pl-4"
            }
          >
            <p className={"hidden font-semibold lg:flex"}>
              {user.firstName.charAt(0).toUpperCase() +
                user.firstName.substring(1)}{" "}
              {user.lastName.toUpperCase()}
            </p>
            <HeaderDropDown />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
