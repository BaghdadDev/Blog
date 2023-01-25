const { GraphQLError } = require("graphql");

const Query = {
  getPosts: async () => {
    try {
    } catch (errorGetPosts) {
      console.log("Something went wrong during Get Posts", errorGetPosts);
      return new GraphQLError("Something went wrong during Get Posts", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
  getPostById: async (_, { idPost }) => {
    try {
    } catch (errorGetPostById) {
      console.log(
        "Something went wrong during Get Post By Id: " + idPost,
        errorGetPostById
      );
      return new GraphQLError(
        "Something went wrong during Get Post By Id: " + idPost,
        {
          extensions: { code: "ErrorServer" },
        }
      );
    }
  },
  getPostsByIdUser: async (_, { idUser }) => {
    try {
    } catch (errorGetPostsByIdUser) {
      console.log(
        "Something went wrong during Get Posts By Id User",
        errorGetPostsByIdUser
      );
      return new GraphQLError(
        "Something went wrong during Get Posts By Id User",
        {
          extensions: { code: "ErrorServer" },
        }
      );
    }
  },
};

const Mutation = {
  createPost: async (_, { postInput }) => {
    try {
    } catch (errorCreatePost) {
      console.log("Something went wrong during Create Post", errorCreatePost);
      return new GraphQLError("Something went wrong during Create Post", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
  updatePost: async (_, { idPost, postInput }) => {
    try {
    } catch (errorUpdatePost) {
      console.log("Something went wrong during Update Post", errorUpdatePost);
      return new GraphQLError("Something went wrong during Update Post", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
  deletePost: async (_, { idPost, idUser }) => {
    try {
    } catch (errorDeletePost) {
      console.log("Something went wrong during Delete Post", errorDeletePost);
      return new GraphQLError("Something went wrong during Delete Post", {
        extensions: { code: "ErrorServer" },
      });
    }
  },
};

module.exports = { Query, Mutation };
