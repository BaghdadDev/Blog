import React, { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigation,
  useOutletContext,
} from "react-router-dom";

import PATH from "../utils/route-path.jsx";
import { useUserContext } from "../context/userContext.jsx";

export default function RootLayout(props) {
  const { user, signOut } = useUserContext();
  const navigation = useNavigation();
  const location = useLocation();

  return (
    <div
      className={
        "relative flex min-h-screen w-screen flex-col text-sm md:text-base"
      }
    >
      <header
        className={
          "sticky top-0 left-0 flex w-full items-center justify-between bg-white px-2 py-4 shadow-lg"
        }
      >
        <span>Blog Logo</span>
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
              <Link to={PATH.SIGN_IN} className={"btn-nav"}>
                Sign In
              </Link>
            </div>
          ) : (
            ""
          )
        ) : (
          <div>
            <p>
              {user.firstName} {user.lastName}
            </p>
            <Link to={PATH.PROFILE}>Profile</Link>
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
        )}
      </header>
      <div
        className={`flex grow flex-col items-center justify-center bg-gray-200 ${
          navigation.state === "loading" &&
          "opacity-25 transition-opacity delay-200 duration-200"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export function useUser() {
  return useOutletContext();
}
