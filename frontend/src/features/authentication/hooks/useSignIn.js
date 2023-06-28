import { useMutation } from "@apollo/client";
import { useUserContext } from "../../../context/userContext.jsx";
import { SIGN_IN } from "../../../gql/auth.jsx";

export default function useSignIn() {
  const { persistUser } = useUserContext();

  const [signInMutation, { error: errorSignIn }] = useMutation(SIGN_IN);

  async function signIn(usernameOrEmail, password) {
    try {
      const {
        data: { signIn: dataUser },
      } = await signInMutation({
        variables: {
          usernameOrEmail: usernameOrEmail.toLowerCase(),
          password: password,
        },
      });
      persistUser(dataUser);
    } catch (catchErrorSignIn) {
      console.error(catchErrorSignIn);
    }
  }

  return { signIn, errorSignIn };
}
