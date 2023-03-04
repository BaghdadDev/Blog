const { GraphQLError } = require("graphql");
const bcrypt = require("bcryptjs");

const UserModel = require("../../models/UserModel.js");
const { getAccessTokenByIdUser } = require("../../utils/authFunctions");
const storeFile = require("../../utils/storeFile");

const Mutation = {
  signUp: async (_, { userInput }) => {
    console.log("Resolver: signUp");
    try {
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
      const photo = await storeFile(userInput.photo.file);
      let { _doc: user } = await UserModel.create({
        ...userInput,
        photo: photo._id,
      });
      const token = getAccessTokenByIdUser(user._id);
      user.password = undefined;
      delete user.password;
      return { ...user, photo: { ...photo }, token: { ...token } };
    } catch (errorSignUp) {
      console.log("Something went wrong during signUp", errorSignUp);
      return new GraphQLError("Something went wrong during signUp", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
  signIn: async (_, { usernameOrEmail, password }) => {
    console.log("Resolver: signIn");
    try {
      const user = await UserModel.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      }).populate({ path: "photo" });
      if (!user)
        return new GraphQLError("There is no user with these credentials", {
          extensions: { code: "NOT-FOUND" },
        });
      if (!bcrypt.compareSync(password, user?.password))
        return new GraphQLError("Password is incorrect", {
          extensions: { code: "UNAUTHORIZED" },
        });
      const token = getAccessTokenByIdUser(user._id);
      return {
        ...user._doc,
        token: { ...token },
      };
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
