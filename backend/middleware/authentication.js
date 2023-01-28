const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/UserModel");

async function authenticationMiddleware(resolve, root, args, context, info) {
  try {
    const accessToken =
      context.headers.authorization &&
      String(context.headers.authorization).split(" ")[1];
    if (!accessToken) return await resolve(root, args, context, info);
    let idUser = null;
    try {
      idUser = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (errorVerifyingJWT) {
      return new GraphQLError(
        "Your authentication is invalid, the Access Token is not valid.",
        {
          extensions: { code: "NOT-AUTHENTICATED" },
        }
      );
    }
    return await resolve(root, { ...args, idUser: idUser }, context, info);
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
