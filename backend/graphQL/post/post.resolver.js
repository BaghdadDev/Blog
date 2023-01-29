const { GraphQLError } = require("graphql");

const PostModel = require("../../models/PostModel");

const Query = {
  getPosts: async () => {
    try {
      console.log("Resolver: getPosts");
      const posts = await PostModel.find();
      if (!posts || posts.length === 0)
        return new GraphQLError("There is no post available", {
          extensions: { code: "NOT-FOUND" },
        });
      return posts.map((post) => ({ ...post._doc }));
    } catch (errorGetPosts) {
      console.log("Something went wrong during Get Posts", errorGetPosts);
      return new GraphQLError("Something went wrong during Get Posts", {
        extensions: { code: "ERROR-SERVER" },
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
          extensions: { code: "ERROR-SERVER" },
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
          extensions: { code: "ERROR-SERVER" },
        }
      );
    }
  },
};

const Mutation = {
  createPost: async (_, { postInput }) => {
    try {
      console.log("Resolver: createPost");
      const { _doc: post } = await PostModel.create({ ...postInput });
      return { ...post };
    } catch (errorCreatePost) {
      console.log("Something went wrong during Create Post", errorCreatePost);
      return new GraphQLError("Something went wrong during Create Post", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
  updatePost: async (_, { idPost, postInput, idUser }) => {
    try {
      console.log("Resolver: updatePost");
      const ifExists = await PostModel.findById(idPost);
      if (!ifExists)
        return new GraphQLError("There no post with this id: " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      if (!ifExists.user.equals(idUser))
        return new GraphQLError("Your are not allowed to update this post", {
          extensions: { code: "NOT-ALLOWED" },
        });
      const { _doc: post } = await PostModel.findOneAndUpdate(
        { _id: idPost },
        { ...postInput },
        { upsert: true }
      );
      return { ...post };
    } catch (errorUpdatePost) {
      console.log("Something went wrong during Update Post", errorUpdatePost);
      return new GraphQLError("Something went wrong during Update Post", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
  deletePost: async (_, { idPost, idUser }) => {
    try {
      console.log("Resolver: deletePost");
      const postExists = await PostModel.findById(idPost);
      if (!postExists)
        return new GraphQLError("There no post with this id: " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      if (postExists.user.equals(idUser))
        return new GraphQLError("Your are not allowed to delete this post", {
          extensions: { code: "NOT-ALLOWED" },
        });
      await PostModel.findOneAndDelete({ _id: idPost });
    } catch (errorDeletePost) {
      console.log("Something went wrong during Delete Post", errorDeletePost);
      return new GraphQLError("Something went wrong during Delete Post", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
};

module.exports = { Query, Mutation };
