import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { SIGN_IN } from "../gql/auth.jsx";
import { useMutation } from "@apollo/client";
import { useUserContext } from "../context/userContext.jsx";
import PATH from "../utils/route-path.jsx";
import CustomInput from "../components/Custom/CustomInput.jsx";
import OvalLoader from "../components/OvalLoader.jsx";
import ErrorGraphQL from "../components/ErrorGraphQL";

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const { persistUser } = useUserContext();

  const [signIn, { error: errorSignIn }] = useMutation(SIGN_IN);

  async function handleSubmitSignIn(data) {
    try {
      const {
        data: { signIn: dataUser },
      } = await signIn({
        variables: {
          usernameOrEmail: data.usernameOrEmail.toLowerCase(),
          password: data.password,
        },
      });
      persistUser(dataUser);
      // navigate(PATH.ROOT);
    } catch (catchErrorSignIn) {
      console.error(catchErrorSignIn);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSignIn)}
      className={
        "relative flex w-full max-w-2xl flex-col items-center gap-y-14 rounded-lg bg-blue-500 px-2 py-4"
      }
    >
      {errorSignIn && <ErrorGraphQL errorGraphQL={errorSignIn} />}
      <h1 className={"text-3xl font-semibold text-gray-200 md:text-4xl"}>
        Sign In
      </h1>
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
        {isSubmitting ? <OvalLoader /> : "Sign In"}
      </button>
      <Link
        to={"../" + PATH.SIGN_UP}
        className={"link-form absolute right-1 bottom-1 text-xs"}
      >
        Sign Up
      </Link>
    </form>
  );
}

export default SignIn;
