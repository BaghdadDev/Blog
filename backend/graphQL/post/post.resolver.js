const { GraphQLError } = require("graphql");

const PostModel = require("../../models/PostModel");
const UserModel = require("../../models/UserModel");
const storeFile = require("../../utils/storeFile");
const CommentModel = require("../../models/CommentModel");
const FileModel = require("../../models/FileModel.js");

const pubSub = require("../../config/PubSub.js");

const Query = {
  getPosts: async () => {
    console.log("Resolver: getPosts");
    try {
      const posts = await PostModel.find()
        .populate({ path: "user", populate: { path: "photo" } })
        .populate({ path: "picture" })
        .populate({ path: "likes", select: "_id" })
        .populate({ path: "comments", select: "_id" })
        .sort({ createdAt: -1 });
      if (!posts || posts.length === 0)
        return new GraphQLError("There is no post available", {
          extensions: { code: "NOT-FOUND" },
        });
      return posts.map((post) => ({
        ...post._doc,
      }));
    } catch (errorGetPosts) {
      console.log("Something went wrong during Get Posts", errorGetPosts);
      return new GraphQLError("Something went wrong during Get Posts", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
  getPostById: async (_, { idPost }) => {
    console.log("Resolver: getPostById");
    try {
      const post = await PostModel.findById(idPost)
        .populate({ path: "user", populate: { path: "photo" } })
        .populate({ path: "picture" })
        .populate({
          path: "likes",
          select: "-password",
          populate: { path: "photo" },
        })
        .populate({ path: "comments", select: "_id" });
      if (!post)
        return new GraphQLError("There is no Post with Id: " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      return {
        ...post._doc,
      };
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
  createPost: async (_, { postInput }, { postController }) => {
    console.log("Resolver: createPost");
    try {
      // Store the file
      const file = await storeFile(postInput.picture.file);
      // Create new post
      const { _doc: createdPost } = await PostModel.create({
        ...postInput,
        picture: file._id,
      });
      // Retrieve the new post with populate
      const newPost = await PostModel.findById(createdPost._id)
        .populate({ path: "user", populate: { path: "photo" } })
        .populate({ path: "picture" })
        .populate({
          path: "likes",
          select: "-password",
          populate: { path: "photo" },
        })
        .populate({ path: "comments", select: "_id" });
      // Return the new post for subscription
      await pubSub.publish("CREATED_POST", {
        createdPost: newPost,
      });
      // Return the new post for resolver
      return newPost;
    } catch (errorCreatePost) {
      console.log("Something went wrong during Create Post", errorCreatePost);
      return new GraphQLError("Something went wrong during Create Post", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
  updatePostText: async (_, { idPost, postInput, idUser }) => {
    try {
      console.log("Resolver: updatePostText");
      const ifExists = await PostModel.findById(idPost);
      if (!ifExists)
        return new GraphQLError("There is no post with id: " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      if (!ifExists.user.equals(idUser))
        return new GraphQLError("Your are not allowed to update this post", {
          extensions: { code: "NOT-ALLOWED" },
        });
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: idPost },
        { ...postInput },
        { new: true }
      )
        .populate({ path: "picture" })
        .populate({ path: "user", populate: { path: "photo" } })
        .populate({ path: "likes", select: "_id" })
        .populate({ path: "comments", select: "_id" });
      await pubSub.publish("UPDATED_POST_TEXT", {
        updatedPostText: updatedPost,
      });
      await pubSub.publish("UPDATED_POST", {
        updatedPost: updatedPost,
      });
      return updatedPost;
    } catch (errorUpdatePost) {
      console.log("Something went wrong during Update Post", errorUpdatePost);
      return new GraphQLError("Something went wrong during Update Post", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
  updatePostPicture: async (_, { idPost, picture, idUser }) => {
    console.log("resolver: updatePostPicture");
    try {
      const ifExists = await PostModel.findById(idPost);
      if (!ifExists)
        return new GraphQLError("There is no post with id: " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      if (!ifExists.user.equals(idUser))
        return new GraphQLError("Your are not allowed to update this post", {
          extensions: { code: "NOT-ALLOWED" },
        });
      // Delete the older picture
      await FileModel.findOneAndDelete({ _id: ifExists.picture });
      // Store the new picture
      const file = await storeFile(picture.file);
      // Update the id picture for the post
      const updatedPost = await PostModel.findByIdAndUpdate(
        idPost,
        {
          picture: file._id,
        },
        { new: true }
      )
        .populate({ path: "picture" })
        .populate({
          path: "user",
          select: "-password",
          populate: { path: "photo" },
        })
        .populate({ path: "likes", select: "_id" })
        .populate({ path: "comments", select: "_id" });
      // Publish the subscription
      await pubSub.publish("UPDATED_POST_PICTURE", {
        updatedPostPicture: file,
      });
      await pubSub.publish("UPDATED_POST", {
        updatedPost: updatedPost,
      });
      // Return
      return file;
    } catch (errorUpdatePostPicture) {
      console.log(
        "Something went wrong during Update Post Picture",
        errorUpdatePostPicture
      );
      return new GraphQLError(
        "Something went wrong during Update Post Picture",
        {
          extensions: { code: "ERROR-SERVER" },
        }
      );
    }
  },
  toggleLikePost: async (_, { idPost, idUser }) => {
    console.log("resolver: toggleLikePost");
    try {
      const post = await PostModel.findOne({ _id: idPost });
      if (!post) {
        return new GraphQLError("There is no post with id " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      }
      if (post.likes.findIndex((userId) => userId.equals(idUser)) !== -1) {
        await PostModel.findOneAndUpdate(
          { _id: idPost },
          { $pull: { likes: idUser } }
        );
      } else {
        await PostModel.findOneAndUpdate(
          { _id: idPost },
          { $push: { likes: idUser } }
        );
      }
      await pubSub.publish("TOGGLED_LIKE_POST_DETAILS", {
        toggledLikePostDetails: { _id: idUser },
      });
      await pubSub.publish("TOGGLED_LIKE_POST", {
        toggledLikePost: { _id: idPost, user: { _id: idUser } },
      });
      return true;
    } catch (errorToggleLikePost) {
      console.log(
        "Something went wrong during Toggling Like Post",
        errorToggleLikePost
      );
      return new GraphQLError(
        "Something went wrong during Toggling Like Post",
        {
          extensions: { code: "ERROR-SERVER" },
        }
      );
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
      if (!postExists.user.equals(idUser))
        return new GraphQLError("Your are not allowed to delete this post", {
          extensions: { code: "NOT-ALLOWED" },
        });
      await CommentModel.deleteMany({ post: idPost });
      await PostModel.findOneAndDelete({ _id: idPost });
      await pubSub.publish("DELETED_POST", {
        deletedPost: idPost,
      });
      await pubSub.publish("DELETED_POST_DETAILS", {
        deletedPostDetails: idPost,
      });
      return idPost;
    } catch (errorDeletePost) {
      console.log("Something went wrong during Delete Post", errorDeletePost);
      return new GraphQLError("Something went wrong during Delete Post", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
  searchPosts: async (_, { search }) => {
    console.log("Resolver: deletePost");
    try {
      const regex = new RegExp(search, "i");
      const posts = await PostModel.find({
        $or: [{ story: { $regex: regex } }, { title: { $regex: regex } }],
      })
        .populate({ path: "picture" })
        .populate({
          path: "user",
          select: "-password",
          populate: { path: "photo" },
        })
        .populate({ path: "likes", select: "_id" })
        .populate({ path: "comments", select: "_id" });
      if (posts.length === 0) {
        return new GraphQLError("No posts found", {
          extensions: { code: "NOT-FOUND" },
        });
      }
      return posts;
    } catch (errorSearchPost) {
      console.log("Something went wrong during Search Posts", errorSearchPost);
      return new GraphQLError("Something went wrong during Search Posts", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
};

const Subscription = {
  createdPost: {
    subscribe: () => pubSub.asyncIterator(["CREATED_POST"]),
  },
  deletedPost: {
    subscribe: () => pubSub.asyncIterator(["DELETED_POST"]),
  },
  deletedPostDetails: {
    subscribe: () => pubSub.asyncIterator(["DELETED_POST_DETAILS"]),
  },
  updatedPost: {
    subscribe: () => pubSub.asyncIterator(["UPDATED_POST"]),
  },
  updatedPostText: {
    subscribe: () => pubSub.asyncIterator(["UPDATED_POST_TEXT"]),
  },
  updatedPostPicture: {
    subscribe: () => pubSub.asyncIterator(["UPDATED_POST_PICTURE"]),
  },
  toggledLikePostDetails: {
    subscribe: () => pubSub.asyncIterator(["TOGGLED_LIKE_POST_DETAILS"]),
  },
  toggledLikePost: {
    subscribe: () => pubSub.asyncIterator(["TOGGLED_LIKE_POST"]),
  },
};

module.exports = { Query, Mutation, Subscription };
