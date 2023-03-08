const { GraphQLError } = require("graphql");

const CommentModel = require("../../models/CommentModel.js");
const PostModel = require("../../models/PostModel.js");
const pubSub = require("../../config/PubSub.js");

const Query = {
  getComments: async (_, { idPost }) => {
    console.log("resolver: getComments");
    try {
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
          populate: { path: "photo" },
        })
        .populate({ path: "likes", populate: { path: "photo" } })
        .populate({ path: "post", select: "_id" });
      // Return the new comment for subscription
      await pubSub.publish("COMMENT_CREATED", {
        commentCreated: commentCreated,
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
      await PostModel.findByIdAndUpdate(
        { _id: comment.post },
        { $pull: { comments: idComment } },
        { upsert: true }
      );
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
          { upsert: true }
        );
      } else {
        commentUpdated = await CommentModel.findOneAndUpdate(
          { _id: idComment },
          { $push: { likes: idUser } },
          { upsert: true }
        );
      }
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
};

const Subscription = {
  commentCreated: {
    subscribe: () => pubSub.asyncIterator(["COMMENT_CREATED"]),
  },
};

module.exports = { Query, Mutation, Subscription };
