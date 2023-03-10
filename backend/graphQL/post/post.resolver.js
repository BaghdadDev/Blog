const { GraphQLError } = require("graphql");

const PostModel = require("../../models/PostModel");
const UserModel = require("../../models/UserModel");
const storeFile = require("../../utils/storeFile");
const CommentModel = require("../../models/CommentModel");
const pubSub = require("../../config/PubSub.js");

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
      return posts.map((post) => ({
        ...post._doc,
        nbrLikes: post.likes.length,
        likes: undefined,
        nbrComments: post.comments.length,
        comments: undefined,
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
          select: "_id firstName lastName photo",
          populate: { path: "photo" },
        });
      if (!post)
        return new GraphQLError("There is no Post with Id: " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      return {
        ...post._doc,
        comments: undefined,
        nbrComments: post.comments.length,
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
        .populate({ path: "picture" });
      // Return the new post for subscription
      await pubSub.publish("CREATED_POST", {
        postCreated: {
          ...newPost._doc,
          nbrComments: newPost.comments.length,
          nbrLikes: newPost.likes.length,
        },
      });
      // Return the new post for resolver
      return { ...newPost._doc };
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
  toggleLikePost: async (_, { idPost, idUser }) => {
    console.log("resolver: toggleLikePost");
    try {
      const post = await PostModel.findOne({ _id: idPost });
      if (!post) {
        return new GraphQLError("There is no post with id " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      }
      let updatedLikes;
      if (post.likes.findIndex((userId) => userId.equals(idUser)) !== -1) {
        await PostModel.findOneAndUpdate(
          { _id: idPost },
          { $pull: { likes: idUser } }
        );
        await pubSub.publish("DISLIKED_POST", {
          dislikedPost: idUser,
        });
      } else {
        await PostModel.findOneAndUpdate(
          { _id: idPost },
          { $push: { likes: idUser } }
        );
        const user = await UserModel.findById(idUser).populate({
          path: "photo",
        });
        await pubSub.publish("LIKED_POST", {
          likedPost: { ...user._doc },
        });
      }
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
      return idPost;
    } catch (errorDeletePost) {
      console.log("Something went wrong during Delete Post", errorDeletePost);
      return new GraphQLError("Something went wrong during Delete Post", {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
};

const Subscription = {
  postCreated: {
    subscribe: () => pubSub.asyncIterator(["CREATED_POST"]),
  },
  likedPost: {
    subscribe: () => pubSub.asyncIterator(["LIKED_POST"]),
  },
  dislikedPost: {
    subscribe: () => pubSub.asyncIterator(["DISLIKED_POST"]),
  },
  deletedPost: {
    subscribe: () => pubSub.asyncIterator(["DELETED_POST"]),
  },
};

module.exports = { Query, Mutation, Subscription };
