const { Schema, models, model } = require("mongoose");

const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema(
  {
    user: { type: ObjectId, ref: "users", required: true },
    post: { type: ObjectId, ref: "posts", required: true },
    comment: { type: String, required: true },
    likes: {
      type: [{ type: ObjectId, ref: "users" }],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = models.comments || model("comments", CommentSchema);
