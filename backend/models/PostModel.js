const { Schema, models, model } = require("mongoose");

const ObjectId = Schema.Types.ObjectId;

const PortSchema = new Schema(
  {
    title: { type: String, required: true },
    story: { type: String, required: true },
    user: { type: ObjectId, ref: "users", required: true },
    picture: {
      type: ObjectId,
      ref: "files",
      required: true,
    },
    likes: {
      type: [{ type: ObjectId, ref: "users" }],
      required: true,
      default: [],
    },
    comments: {
      type: [{ type: ObjectId, ref: "comments" }],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = models.posts || model("posts", PortSchema);
