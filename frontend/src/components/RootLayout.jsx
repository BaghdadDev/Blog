import React from "react";
import { Outlet } from "react-router-dom";

function RootLayout(props) {
  return (
    <div id="detail">
      <Outlet />
    </div>
  );
}

export default RootLayout;
