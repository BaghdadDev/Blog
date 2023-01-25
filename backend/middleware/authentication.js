const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

/*
 *** Here we will process to check an authentication of the user by JsonWebToken
 */
async function authenticationMiddleware(resolve, root, args, context, info) {
  try {
    return await resolve(root, args, context, info);
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
