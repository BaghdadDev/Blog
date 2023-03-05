const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");

const PostModel = require("../../models/PostModel");
const storeFile = require("../../utils/storeFile");
const CommentModel = require("../../models/CommentModel");

const pubSub = new PubSub();

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
      const comments = await CommentModel.find({ post: idPost })
        .populate({
          path: "user",
          select: "_id firstName lastName photo",
          populate: { path: "photo" },
        })
        .populate({ path: "post", select: "_id" })
        .populate({
          path: "likes",
          select: "_id firstName lastName photo",
          populate: { path: "photo" },
        })
        .sort({ createdAt: -1 });
      return { ...post._doc, comments: comments.map((c) => c) };
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
      await pubSub.publish("POST_CREATED", {
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
      const post = await PostModel.findOne({ _id: idPost }).populate({
        path: "likes",
        select: "_id",
      });
      if (!post) {
        return new GraphQLError("There is no post with id " + idPost, {
          extensions: { code: "NOT-FOUND" },
        });
      }
      if (
        post.likes.findIndex(({ _id: userId }) => userId.equals(idUser)) !== -1
      ) {
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

const Subscription = {
  postCreated: {
    subscribe: () => pubSub.asyncIterator(["POST_CREATED"]),
  },
};

module.exports = { Query, Mutation, Subscription };
