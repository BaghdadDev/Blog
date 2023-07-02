import React, { useEffect } from "react";
import {
  Outlet,
  useNavigate,
  useNavigation,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import { useUserContext } from "../../context/userContext.jsx";
import PATH from "../../utils/route-path.jsx";

export default function Index() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const location = useLocation();

  const userContext = useUserContext();

  useEffect(() => {
    if (navigation.state !== "loading") {
      if (!userContext.user) {
        if (![PATH.SIGN_IN, PATH.SIGN_UP].includes(location.pathname)) {
          navigate(PATH.SIGN_IN);
        }
      } else {
        if ([PATH.SIGN_IN, PATH.SIGN_UP].includes(location.pathname)) {
          navigate(PATH.ROOT);
        }
      }
    }
  }, [navigation.state, userContext.user]);

  return (
    <div
      className={
        "relative flex w-full min-h-screen flex-col text-sm md:text-base"
      }
    >
      <Header />
      <div
        className={`w-full grow flex flex-col items-center justify-center bg-gradient-to-t from-emerald-200 to-emerald-100 ${
          navigation.state ||
          (loading === "loading" &&
            "opacity-25 transition-opacity delay-200 duration-200")
        }`}
      >
        {/* {navigation.state === "loading" ? <OvalLoader /> : <Outlet />} */}
        <Outlet />
      </div>
    </div>
  );
}
