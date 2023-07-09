import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import PATH from "../config/route-path.jsx";
import CustomInput from "../components/Custom/CustomInput.jsx";
import OvalLoader from "../components/OvalLoader.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";
import { useSignIn } from "../features/authentication";

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn, error, loading } = useSignIn();

  function handleSignIn(data) {
    signIn(data.usernameOrEmail, data.password);
  }

  return (
    <div className={"flex min-h-screen flex-col items-center"}>
      <h1
        className={
          "left-1/2 my-10 text-5xl font-semibold text-slate-800 md:text-6xl"
        }
      >
        Sign In
      </h1>
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className={
          "absolute top-1/2 flex w-[calc(100%_-_10px)] max-w-xl -translate-y-1/2 flex-col items-center gap-y-14 rounded-lg bg-slate-800 px-2 py-4 shadow-2xl md:w-full"
        }
      >
        <div className={"flex w-full flex-col items-center gap-10"}>
          <CustomInput
            name={"usernameOrEmail"}
            placeholder={"Username or Email"}
            register={register}
            errors={errors}
            rules={{
              required: "Please, enter your username or email",
              minLength: {
                value: 4,
                message: "It must be at least 4 characters long",
              },
            }}
          />
          <CustomInput
            type={"password"}
            name={"password"}
            placeholder={"Password"}
            register={register}
            errors={errors}
            rules={{
              required: "Please, enter a password",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            }}
          />
        </div>
        <button type={"submit"} className={"btn-form mb-4"}>
          {loading ? <OvalLoader /> : "Sign In"}
        </button>
        {error && <ErrorGraphQL errorGraphQL={error} />}
        <Link
          to={"../" + PATH.SIGN_UP}
          className={"link-form absolute right-1 bottom-1 text-xs"}
        >
          Sign Up
        </Link>
      </form>
    </div>
  );
}

export default SignIn;
