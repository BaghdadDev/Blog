import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Header from "./Header.jsx";

export default function RootLayout() {
  const navigation = useNavigation();
  return (
    <div
      className={
        "relative flex min-h-screen w-full flex-col text-sm md:text-base"
      }
    >
      <Header />
      <div
        className={`flex w-full grow flex-col items-center justify-center bg-gray-200 ${
          navigation.state === "loading" &&
          "opacity-25 transition-opacity delay-200 duration-200"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
