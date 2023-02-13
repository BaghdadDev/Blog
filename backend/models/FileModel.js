const { Schema, models, model } = require("mongoose");

const FileSchema = new Schema(
  {
    filename: String,
    contentType: String,
    data: Buffer,
  },
  { timestamps: true }
);

module.exports = models.files || model("files", FileSchema);
