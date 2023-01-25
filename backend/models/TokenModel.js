const { Schema, models, model } = require("mongoose");

const TokenSchema = new Schema(
  {
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = models.tokens || model("tokens", TokenSchema);
