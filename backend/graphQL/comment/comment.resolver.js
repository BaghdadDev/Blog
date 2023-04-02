const { GraphQLError } = require("graphql");

const CommentModel = require("../../models/CommentModel.js");
const PostModel = require("../../models/PostModel.js");
const pubSub = require("../../config/PubSub.js");
const { withFilter } = require("graphql-subscriptions");

const Query = {
  getComments: async (_, { idPost }) => {
    console.log("resolver: getComments");
    try {
      const comments = await CommentModel.find({ post: idPost })
        .populate({
          path: "user",
          select: "-password",
          populate: { path: "photo" },
        })
        .populate({ path: "post", select: "_id" })
        .populate({ path: "likes", select: "_id" })
        .sort({ createdAt: -1 });
      if (!comments || comments.length === 0) {
        return new GraphQLError("There are no comments for this post", {
          extensions: { code: "NOT-FOUND" },
        });
      }
      return comments.map((c) => c);
    } catch (errorGetComments) {
      console.log(`Something went wrong getting comments.`, errorGetComments);
      return new GraphQLError(`Something went wrong getting comments.`, {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
};

const Mutation = {
  createComment: async (_, { commentInput }) => {
    console.log("resolver: createComment");
    try {
      const postIfExists = await PostModel.findById(commentInput.post);
      if (!postIfExists)
        return new GraphQLError(
          "There is no post with id " + commentInput.post,
          {
            extensions: { code: "NOT-FOUND" },
          }
        );
      const comment = await CommentModel.create({ ...commentInput });
      await PostModel.findOneAndUpdate(
        { _id: commentInput.post },
        { $push: { comments: comment._id } },
        { upsert: true }
      );
      const commentCreated = await CommentModel.findById(comment._id)
        .populate({
          path: "user",
          select: "-password",
          populate: { path: "photo" },
        })
        .populate({ path: "post", select: "_id" })
        .populate({ path: "likes", select: "_id" });
      // Return the new comment for subscription
      await pubSub.publish("CREATED_COMMENT", {
        createdComment: commentCreated,
      });
      return commentCreated;
    } catch (errorCreateComment) {
      console.log(`Something went wrong creating comment.`, errorCreateComment);
      return new GraphQLError(`Something went wrong creating comment.`, {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
  deleteComment: async (_, { idUser, idComment }) => {
    try {
      const comment = await CommentModel.findById(idComment);
      if (!comment) {
        return new GraphQLError("There is no such comment for " + idComment, {
          extensions: { code: "NOT-FOUND" },
        });
      }
      if (!comment.user.equals(idUser)) {
        return new GraphQLError("You are not allowed to delete this comment", {
          extensions: { code: "NOT-ALLOWED" },
        });
      }
      await CommentModel.findOneAndDelete({ _id: idComment });
      await PostModel.findOneAndUpdate(
        { _id: comment.post },
        { $pull: { comments: idComment } }
      );
      await pubSub.publish("DELETED_COMMENT", {
        deletedComment: comment._id,
      });
      return { _id: idComment };
    } catch (errorDeleteComment) {
      console.log(`Something went wrong deleting comment.`, errorDeleteComment);
      return new GraphQLError(`Something went wrong deleting comment.`, {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
  toggleLikeComment: async (_, { idUser, idComment }) => {
    console.log("resolver: toggleLikeComment");
    try {
      const comment = await CommentModel.findById(idComment);
      if (!comment) {
        return new GraphQLError("There is no comment with id " + idComment, {
          extensions: { code: "NOT-FOUND" },
        });
      }
      let commentUpdated = undefined;
      if (comment.likes.findIndex((userId) => userId.equals(idUser)) !== -1) {
        commentUpdated = await CommentModel.findOneAndUpdate(
          { _id: idComment },
          { $pull: { likes: idUser } },
          { new: true }
        );
      } else {
        commentUpdated = await CommentModel.findOneAndUpdate(
          { _id: idComment },
          { $push: { likes: idUser } },
          { new: true }
        );
      }
      await pubSub.publish("TOGGLED_LIKE_COMMENT", {
        toggledLikeComment: { _id: idUser, idComment: commentUpdated._id },
      });
      return commentUpdated;
    } catch (errorToggleLikeComment) {
      console.log(
        `Something went wrong Toggling Like Comment.`,
        errorToggleLikeComment
      );
      return new GraphQLError(`Something went wrong Toggling Like Comment.`, {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
  updateComment: async (_, { idComment, commentInput }) => {
    console.log("resolver: updatedComment");
    try {
      const ifExists = await CommentModel.findById(idComment);
      if (!ifExists) {
        return new GraphQLError("There is no comment with id " + idComment, {
          extensions: { code: "NOT-FOUND" },
        });
      }
      const commentUpdated = await CommentModel.findByIdAndUpdate(
        { _id: idComment },
        { ...commentInput },
        { new: true }
      )
        .populate({
          path: "user",
          select: "-password",
          populate: { path: "photo" },
        })
        .populate({ path: "post", select: "_id" })
        .populate({ path: "likes", select: "_id" });
      await pubSub.publish("UPDATED_COMMENT", {
        updatedComment: commentUpdated,
      });
      return commentUpdated;
    } catch (errorUpdateComment) {
      console.log(`Something went wrong Updating Comment.`, errorUpdateComment);
      return new GraphQLError(`Something went wrong Updating Comment.`, {
        extensions: { code: "ERROR-SERVER" },
      });
    }
  },
};

const Subscription = {
  createdComment: {
    subscribe: () => pubSub.asyncIterator(["CREATED_COMMENT"]),
  },
  updatedComment: {
    subscribe: withFilter(
      () => pubSub.asyncIterator("UPDATED_COMMENT"),
      (payload, variables) => {
        return payload.updatedComment._id.equals(variables.idComment);
      }
    ),
  },
  deletedComment: {
    subscribe: () => pubSub.asyncIterator(["DELETED_COMMENT"]),
  },
  toggledLikeComment: {
    subscribe: withFilter(
      () => pubSub.asyncIterator("TOGGLED_LIKE_COMMENT"),
      (payload, variables) => {
        console.log(payload.toggledLikeComment.idComment);
        console.log(variables.idComment);
        console.log(
          payload.toggledLikeComment.idComment.equals(variables.idComment)
        );
        return payload.toggledLikeComment.idComment.equals(variables.idComment);
      }
    ),
  },
};

module.exports = { Query, Mutation, Subscription };
