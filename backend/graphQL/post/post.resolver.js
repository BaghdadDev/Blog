const { GraphQLError } = require("graphql");

const PostModel = require("../../models/PostModel");
const storeFile = require("../../utils/storeFile");

const Query = {
  getPosts: async () => {
    console.log("Resolver: getPosts");
    try {
      const posts = await PostModel.find()
        .populate({ path: "user", populate: { path: "photo" } })
        .populate({ path: "picture" })
        .sort({ createdAt: -1 });
      if (!posts || posts.length === 0)
        return new GraphQLError("There is no post available", {
          extensions: { code: "NOT-FOUND" },
        });
      return posts.map((post) => {
        const copyPost = { ...post._doc };
        let copyUser = { ...copyPost.user._doc };
        copyPost.password = undefined;
        delete copyPost.password;
        const copyUserPhoto = { ...copyPost.user.photo._doc };
        const copyPicture = { ...copyPost.picture._doc };
        return {
          ...copyPost,
          picture: {
            ...copyPicture,
            data: copyPicture.data.toString("base64"),
            // data: undefined,
          },
          user: {
            ...copyUser,
            photo: {
              ...copyUserPhoto,
              data: copyUserPhoto.data.toString("base64"),
              // data: undefined,
            },
          },
        };
      });
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
    console.log("Resolver: createPost");
    try {
      // Store the file
      const file = await storeFile(postInput.picture.file);
      // Create new post
      const { _doc: newPost } = await PostModel.create({
        ...postInput,
        picture: file._id,
      });
      // Return the new post
      return { ...newPost };
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
    console.log("Resolver: deletePost");
    try {
      const postExists = await PostModel.findById(idPost);
      if (!postExists)
        return new GraphQLError("There is no post with this id: " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      if (postExists.user.equals(idUser))
        return new GraphQLError("Your are not allowed to delete this post", {
          extensions: { code: "NOT-ALLOWED" },
        });
      await PostModel.findOneAndDelete({ _id: idPost });
      return { ...postExists._doc };
    } catch (errorDeletePost) {
      console.log("Something went wrong during Delete Post", errorDeletePost);
      return new GraphQLError("Something went wrong during Delete Post", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
};

module.exports = { Query, Mutation };
