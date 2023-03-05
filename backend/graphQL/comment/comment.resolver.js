const { GraphQLError } = require("graphql");

const CommentModel = require("../../models/CommentModel.js");
const PostModel = require("../../models/PostModel.js");

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
        { $push: comment._id },
        { upsert: true }
      );
      return { _id: comment._id };
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
      console.log(idUser);
      console.log(comment.user);
      if (!comment.user.equals(idUser)) {
        return new GraphQLError("You are not allowed to delete this comment", {
          extensions: { code: "NOT-ALLOWED" },
        });
      }
      await CommentModel.findOneAndDelete({ _id: idComment });
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

module.exports = { Mutation };
