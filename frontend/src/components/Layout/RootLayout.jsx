import React, { useEffect } from "react";
import { Outlet, useNavigate, useNavigation } from "react-router-dom";

import Header from "./Header.jsx";
import { useUserContext } from "../../context/userContext.jsx";
import PATH from "../../utils/route-path.jsx";
import OvalLoader from "../OvalLoader.jsx";

export default function RootLayout() {
  const navigate = useNavigate();
  const navigation = useNavigation();

  const userContext = useUserContext();

  useEffect(() => {
    if (navigation.state !== "loading") {
      if (!userContext.user) {
        navigate(PATH.SIGN_IN);
      } else {
        navigate(PATH.ROOT);
      }
    }
  }, [navigation.state, userContext.user]);

  return (
    <div
      className={
        "relative flex min-h-screen w-full flex-col text-sm md:text-base"
      }
    >
      <Header />
      <div
        className={`flex w-full grow flex-col items-center justify-center bg-gradient-to-t from-gray-200 to-gray-100 ${
          navigation.state === "loading" &&
          "opacity-25 transition-opacity delay-200 duration-200"
        }`}
      >
        {/* {navigation.state === "loading" ? <OvalLoader /> : <Outlet />} */}
        <Outlet />
      </div>
    </div>
  );
}
