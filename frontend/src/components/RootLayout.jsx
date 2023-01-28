import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

import PATH from "../utils/route-path.jsx";
import { useUserContext } from "../context/userContext.jsx";

function RootLayout(props) {
  const { user } = useUserContext();

  useEffect(() => {
    console.log("user:", user);
  }, [user]);

  return (
    <div
      className={
        "min-h-screen w-screen flex-col flex text-sm md:text-base relative"
      }
    >
      <header
        className={
          "px-2 py-4 sticky top-0 left-0 w-full bg-white shadow-lg flex items-center justify-between"
        }
      >
        <span>Blog Logo</span>
        <form
          className={
            "p-2 absolute left-1/2 -translate-x-1/2 w-52 bg-gray-200 rounded-lg"
          }
        >
          <input
            type={"text"}
            placeholder={"Search post..."}
            className={"bg-transparent w-full h-full outline-none"}
          />
        </form>
        {Object.keys(user).length === 0 ? (
          <div>
            <Link to={PATH.SIGN_IN} className={"btn-nav"}>
              Connection
            </Link>
          </div>
        ) : (
          <div>
            <p>
              {user.firstName} {user.lastName}
            </p>
            <Link to={PATH.PROFILE}>Profile</Link>
          </div>
        )}
      </header>
      <div className={"bg-gray-200 grow"}>
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
