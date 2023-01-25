const { Schema, models, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "moderator", "creator"],
      required: true,
      default: "creator",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 12);
  next();
});

module.exports = models.users || model("users", UserSchema);
