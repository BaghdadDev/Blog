const { GraphQLError } = require("graphql");
const bcrypt = require("bcryptjs");

const UserModel = require("../../models/UserModel.js");
const { getAccessTokenByIdUser } = require("../../utils/authFunctions");

const Mutation = {
  signUp: async (_, { userInput }) => {
    try {
      console.log("Resolver: signUp");
      if (Object.keys(userInput).length === 0)
        return new GraphQLError("Please fill in your information", {
          extensions: { code: "INVALID-INPUT" },
        });
      const ifExistsByUsername = await UserModel.findOne({
        username: userInput.username,
      });
      if (ifExistsByUsername)
        return new GraphQLError(
          "This username is already used, please change to another one",
          {
            extensions: { code: "CONFLICT-USERNAME" },
          }
        );
      const ifExistsByEmail = await UserModel.findOne({
        email: userInput.email,
      });
      if (ifExistsByEmail)
        return new GraphQLError(
          "This email is already used, please change to another one",
          {
            extensions: { code: "CONFLICT-EMAIL" },
          }
        );
      let { _doc: user } = await UserModel.create({ ...userInput });
      const token = getAccessTokenByIdUser(user._id);
      user.password = undefined;
      delete user.password;
      return { ...user, token: { ...token } };
    } catch (errorSignUp) {
      console.log("Something went wrong during signUp", errorSignUp);
      return new GraphQLError("Something went wrong during signUp", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
  signIn: async (_, { credentials }) => {
    try {
      console.log("Resolver: signIn");
      const { _doc: user } = await UserModel.findOne({
        $or: [
          { username: credentials?.username },
          { email: credentials?.email },
        ],
      });
      if (!user)
        return new GraphQLError("There is no user with these credentials", {
          extensions: { code: "NOT-FOUND" },
        });
      const token = getAccessTokenByIdUser(user._id);
      return { ...user, token: { ...token } };
    } catch (errorSignIn) {
      console.log("Something went wrong during signIn", errorSignIn);
      return new GraphQLError("Something went wrong during signIn", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
  signOut: async (_, { credentials }) => {
    try {
      console.log("Resolver: signOut");
    } catch (errorSignOut) {
      console.log("Something went wrong during signOut", errorSignOut);
      return new GraphQLError("Something went wrong during signOut", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
};

module.exports = { Mutation };
