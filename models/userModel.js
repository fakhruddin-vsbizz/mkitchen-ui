const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already exists"],
    },
    password: {
      type: String,
      required: [true, "please enter the user password"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userModel);
