import React from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { FaSignInAlt, FaPenFancy } from "react-icons/fa";

import PATH from "../../utils/route-path.jsx";
import HeaderDropDown from "./HeaderDropDown.jsx";
import { useUserContext } from "../../context/userContext.jsx";
import CustomButton from "../Custom/CustomButton.jsx";

function Header() {
  const { user } = useUserContext();

  const location = useLocation();
  return (
    <header
      className={
        "sticky top-0 left-0 z-10 flex h-16 w-full items-center justify-between bg-white px-2 py-4 shadow-lg"
      }
    >
      <Link to={PATH.ROOT}>Blog Logo</Link>
      <form
        className={
          "absolute left-1/2 w-52 -translate-x-1/2 rounded-lg bg-gray-200 p-2"
        }
      >
        <input
          type={"text"}
          placeholder={"Search post..."}
          className={"h-full w-full bg-transparent outline-none"}
        />
      </form>
      {!user ? (
        location.pathname !== PATH.SIGN_IN &&
        location.pathname !== PATH.SIGN_UP ? (
          <div>
            <Link to={PATH.SIGN_IN}>
              <CustomButton label={"Sign In"} Icon={FaSignInAlt} />
            </Link>
          </div>
        ) : (
          ""
        )
      ) : (
        <div className={"flex items-center"}>
          <NavLink
            to={PATH.NEW_POST}
            className={({ isActive }) =>
              isActive ? "rounded bg-gray-200 px-2" : ""
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
            <p className={"font-semibold"}>
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
