const { GraphQLError } = require("graphql");
const bcrypt = require("bcryptjs");

const UserModel = require("../../models/UserModel.js");

const Mutation = {
  signUp: async (_, { userInput }) => {
    try {
      console.log("signUp");
    } catch (errorSignUp) {
      console.log("Something went wrong during signUp", errorSignUp);
      return new GraphQLError("Something went wrong during signUp", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
  signIn: async (_, { credentials }) => {
    try {
      console.log("signUp");
    } catch (errorSignIn) {
      console.log("Something went wrong during signIn", errorSignIn);
      return new GraphQLError("Something went wrong during signIn", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
  signOut: async (_, { credentials }) => {
    try {
      console.log("signUp");
    } catch (errorSignOut) {
      console.log("Something went wrong during signOut", errorSignOut);
      return new GraphQLError("Something went wrong during signOut", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
};

module.exports = { Mutation };
