import React, { useEffect } from "react";
import { Form, Link, useActionData, useFetcher } from "react-router-dom";

import PATH from "../utils/route-path.jsx";
import CustomInput from "../components/Custom/CustomInput.jsx";
import apolloClient from "../config/apollo-client.jsx";
import { SIGN_UP } from "../gql/auth.jsx";
import { useUserContext } from "../context/userContext.jsx";

export async function action({ request, response }) {
  const formData = await request.formData();
  let userInput = {};
  for (const pair of formData.entries()) {
    userInput[pair[0]] = pair[1];
  }
  let action = { errors: {}, user: undefined };
  let errors = {};
  if (Object.values(userInput).includes("")) {
    action.errors.fields = "Please fill out all fields";
    return action;
  }
  if (userInput.username.length < 4)
    action.errors.username = "Username must be at least 4 characters long";
  if (!userInput.email.includes("@"))
    action.errors.email = "Please enter a valid email";
  if (userInput.password.length < 6)
    action.errors.password = "Password must be at least 6 characters long";
  else if (userInput.password !== userInput.confirmPassword)
    action.errors.confirmPassword = "Passwords do not match";

  if (Object.keys(errors).length) return action;

  try {
    const { data: signIn } = await apolloClient.mutate({
      mutation: SIGN_UP,
      variables: {
        userInput: userInput,
      },
    });
    if (signIn?.signIn) {
      action.user = signIn.signIn;
    }
  } catch (errorSignUp) {
    console.log(errorSignUp);
    action.errors = errorSignUp;
  }
  return action;
}

function SignUp() {
  const action = useActionData();
  const fetcher = useFetcher();

  const { setUser } = useUserContext();

  useEffect(() => {
    console.log(fetcher.state);
  }, [fetcher.state]);

  useEffect(() => {
    console.log(action);
  }, [action]);

  return (
    <Form
      method={"post"}
      onSubmit={(event) => {
        console.log(event);
      }}
      className={
        "relative flex flex-col items-center px-2 py-4 rounded-lg bg-blue-500 gap-y-10 w-full max-w-2xl"
      }
    >
      {action?.errors?.fields && (
        <p
          className={
            "absolute top-0 bg-red-300 italic -translate-y-[calc(100%_+_2px)] text-sm p-1 rounded"
          }
        >
          {action?.errors.fields}
        </p>
      )}
      <h1 className={"text-3xl md:text-4xl text-gray-200 font-semibold"}>
        Sign Up
      </h1>
      <div className={"flex items-center flex-col md:flex-row gap-2 w-full"}>
        <CustomInput
          name={"username"}
          placeholder={"Username"}
          error={action?.errors?.username}
        />
        <CustomInput
          name={"email"}
          placeholder={"Email"}
          error={action?.errors?.email}
        />
      </div>
      <div className={"flex items-center flex-col gap-4 w-full"}>
        <div className={"flex items-center gap-x-2 w-full"}>
          <CustomInput name={"firstName"} placeholder={"First Name"} />
          <CustomInput name={"lastName"} placeholder={"Last Name"} />
        </div>
        <div className={"flex items-center gap-x-2 w-full"}>
          <CustomInput
            type={"password"}
            name={"password"}
            placeholder={"Password"}
            error={action?.errors?.password}
          />
          <CustomInput
            type={"password"}
            name={"confirmPassword"}
            placeholder={"Confirm Password"}
            error={action?.errors?.confirmPassword}
          />
        </div>
      </div>
      <button type={"submit"} className={"btn-form mb-4"}>
        {fetcher.state === "submitting" ? "Submitting..." : "Sign Up"}
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
