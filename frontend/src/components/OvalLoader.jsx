import React from "react";
import { Oval } from "react-loader-spinner";

function OvalLoader({ size }) {
  return (
    <Oval
      height={size ?? 20}
      width={size ?? 20}
      color="#0D4BFD"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#e5e7eb"
      strokeWidth={3}
      strokeWidthSecondary={3}
      data-testid={"loading-oval"}
    />
  );
}

export default OvalLoader;
