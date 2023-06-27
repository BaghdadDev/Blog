import { useMutation } from "@apollo/client";

import { useUserContext } from "../context/userContext.jsx";
import { SIGN_UP } from "../gql/auth.jsx";

export default function useSignUp() {
  const [signUpMutation, { error: errorSignUp }] = useMutation(SIGN_UP);

  const { persistUser } = useUserContext();

  async function signUp(username, email, password, firstName, lastName, file) {
    const userInput = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password,
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      photo: file,
    };
    try {
      const res = await signUpMutation({ variables: { userInput } });
      if (res?.data?.signUp) {
        persistUser(res.data.signUp);
      }
    } catch (err) {}
  }

  return { signUp, errorSignUp };
}
