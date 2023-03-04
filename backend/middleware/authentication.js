const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/UserModel");

async function authenticationMiddleware(resolve, root, args, context, info) {
  try {
    const accessToken =
      context.headers.authorization &&
      String(context.headers.authorization).split(" ")[1];
    console.log(info.operation.name.value);
    console.log(accessToken);
    if (!accessToken) {
      if (
        info.operation.name.value === "signUp" ||
        info.operation.name.value === "signIn"
      ) {
        return await resolve(root, args, context, info);
      }
      return new GraphQLError("Your need to be authenticated first.", {
        extensions: { code: "NOT-AUTHENTICATED" },
      });
    }
    try {
      const { idUser } = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      return await resolve(root, { ...args, idUser: idUser }, context, info);
    } catch (errorVerifyingJWT) {
      console.log(errorVerifyingJWT);
      return new GraphQLError(
        "Your authentication is invalid, the Access Token is not valid.",
        {
          extensions: { code: "NOT-AUTHENTICATED" },
        }
      );
    }
  } catch (errorAuthMiddleware) {
    console.log(
      "Something went wrong in authentication middleware.",
      errorAuthMiddleware
    );
    return new GraphQLError(
      "Something went wrong in authentication middleware.",
      {
        extensions: { code: "ErrorServer" },
      }
    );
  }
}

module.exports = authenticationMiddleware;
