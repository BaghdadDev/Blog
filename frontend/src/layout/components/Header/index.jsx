import React from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { FaSignInAlt, FaPenFancy } from "react-icons/fa";

import PATH from "../../../utils/route-path.jsx";
import HeaderDropDown from "./HeaderDropDown.jsx";
import { useUserContext } from "../../../context/userContext.jsx";
import CustomButton from "../../../components/Custom/CustomButton.jsx";
import Search from "../Search/index.jsx";

function Header() {
  const { user } = useUserContext();

  const location = useLocation();

  return (
    <header
      className={
        "left- sticky top-0 z-20 flex h-16 w-full items-center justify-between bg-slate-800 px-2 py-4 text-sm text-slate-100 shadow-lg"
      }
    >
      <Link to={PATH.ROOT}>Blog Logo</Link>
      <Search />
      <NavLink
        to={PATH.NEW_POST}
        className={({ isActive }) => (isActive ? "hidden" : undefined)}
      >
        <button
          className={
            "absolute bottom-0 right-2 translate-y-[calc(100vh_-_74px)] scale-90 rounded-full bg-slate-600 p-4 shadow-lg transition duration-300 hover:scale-100 hover:border-green-600 hover:bg-slate-700 lg:translate-y-[calc(100%_+_10px)]"
          }
        >
          <FaPenFancy className={"h-4 w-4 text-slate-100 shadow-lg"} />
        </button>
      </NavLink>
      <div className={"ml-4 flex items-center gap-x-2"}>
        <p className={"hidden font-semibold lg:flex"}>
          {user.firstName.charAt(0).toUpperCase() + user.firstName.substring(1)}{" "}
          {user.lastName.toUpperCase()}
        </p>
        <HeaderDropDown />
      </div>
    </header>
  );
}

export default Header;
