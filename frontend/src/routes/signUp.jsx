import React from "react";
import { Form, Link } from "react-router-dom";

import PATH from "../utils/route-path.jsx";

export async function action({ request, response }) {
  const formData = await request.formData();
  let userInput = {};
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}, ${pair[1]}`);
    userInput[pair[0]] = pair[1];
  }
  console.log(userInput);
  return null;
}

function SignUp() {
  return (
    <Form
      method={"post"}
      className={
        "relative flex flex-col items-center px-2 py-4 rounded-lg bg-blue-500 gap-y-10"
      }
    >
      <h1 className={"text-3xl text-gray-200 font-semibold"}>Sign Up</h1>
      <div className={"flex items-center gap-x-2"}>
        <input
          type={"text"}
          placeholder={"Username"}
          name={"username"}
          className={"input-form"}
        />
        <input
          type={"text"}
          placeholder={"Email"}
          name={"email"}
          className={"input-form"}
        />
      </div>
      <div className={"flex flex-col items-center gap-y-4"}>
        <div className={"flex items-center gap-x-2"}>
          <input
            type={"text"}
            placeholder={"First Name"}
            name={"firstName"}
            className={"input-form"}
          />
          <input
            type={"text"}
            placeholder={"Last Name"}
            name={"lastName"}
            className={"input-form"}
          />
        </div>
        <div className={"flex items-center gap-x-2"}>
          <input
            type={"text"}
            placeholder={"Password"}
            name={"password"}
            className={"input-form"}
          />
          <input
            type={"text"}
            placeholder={"Confirm your Password"}
            name={"confirmPassword"}
            className={"input-form"}
          />
        </div>
      </div>
      <button type={"submit"} className={"btn-form"}>
        Save
      </button>
      <Link
        to={PATH.SIGN_IN}
        className={"absolute right-1 bottom-1 text-xs link-form"}
      >
        Sign In
      </Link>
    </Form>
  );
}

export default SignUp;
