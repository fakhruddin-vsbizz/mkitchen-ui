const expressAsyncHandler = require("express-async-handler");
const MKUser = require("../models/mkUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const createMkUser = expressAsyncHandler(async (req, res) => {
  const { usertype, username, email, password, action } = req.body;

  if (action === "create_mk") {
    if (
      usertype === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      email === ""
    ) {
      return res.status(403).json({ fieldError: "invalid fields" });
    }

    let testEmail = emailRegex.test(email);

    if (testEmail !== true) {
      return res.status(403).json({ errorEmail: "invalid email" });
    }

    const userAvailable = await MKUser.findOne({ email });

    if (userAvailable) {
      res.status(400);
      throw new Error("User Already Register");
    }

    //Hash Password using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await MKUser.create({
      usertype,
      username,
      email,
      password: hashPassword,
    });

    if (user) {
      return res
        .status(201)
        .json({ _id: user.id, email: user.email, message: "Register user" });
    } else {
      res.status(400);
      throw new Error("Error creating the user");
    }
    // return res.json({ message: "Register user" });
  }
  if (action === "get_user") {
    const user = await MKUser.find({ usertype: usertype });
    if (user) {
      return res.json(user);
    }
  }
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const user = await MKUser.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          usertype: user.usertype,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).json({ accessToken, expiresIn: 604800, user: user });
  } else {
    res.status(401);
    throw new Error("User does not exist or password is incorrect");
  }
});

const updateUserBasedOnNameAndType = expressAsyncHandler(async (req, res) => {
  const { username, usertype, action, email, password } = req.body;

  let testEmail = emailRegex.test(email);
  if (testEmail !== true || username === undefined) {
    return res.status(400).json({ error: "invalid email" });
  }

  const user = await MKUser.findOne({ username, usertype });

  if (user && action === "update_email") {
    const updateUser = await MKUser.findByIdAndUpdate(
      { _id: Object(user._id) },
      { $set: { email: email } },
      { new: true }
    );
    if (updateUser) {
      return res.json({ message: "user email updated successfully" });
    }
  }

  if (user && action === "update_password") {
    const hashPassword = await bcrypt.hash(password, 10);
    const updateUser = await MKUser.findByIdAndUpdate(
      { _id: Object(user._id) },
      { $set: { password: hashPassword } },
      { new: true }
    );
    if (updateUser) {
      return res.json({ message: "user password updated successfully" });
    }
  }
  return res.json({ message: "user email Not updated" });
});

const updatePasswordBasedOnEmail = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let testEmail = emailRegex.test(email);
  if (testEmail !== true) {
    return res.status(400).json({ error: "invalid email" });
  }

  const user = await MKUser.findOne({ email });

  const hashPassword = await bcrypt.hash(password, 10);
  const updateUser = await MKUser.findByIdAndUpdate(
    { _id: Object(user._id) },
    { $set: { password: hashPassword } },
    { new: true }
  );
  if (updateUser) {
    return res
      .status(200)
      .json({ message: "user password updated successfully" });
  }

  return res.status(200).json({ message: "user password Not updated" });
});

const updatePasswordAdmin = expressAsyncHandler(async (req, res) => {
  const { email, password, oldPassword } = req.body;

  const user = await MKUser.findOne({ email });

  if (password === "" || oldPassword === "") {
    return res.status(400).json({ error: "invalid password" });
  }

  const oldPasswordData = await bcrypt.compare(oldPassword, user.password);

  if (oldPasswordData === false) {
    return res.status(400).json({ InvalidPassword: "invalid password" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const updateUser = await MKUser.findByIdAndUpdate(
    { _id: Object(user._id) },
    { $set: { password: hashPassword } },
    { new: true }
  );
  if (updateUser) {
    return res
      .status(200)
      .json({ message: "user password updated successfully" });
  }

  return res.status(200).json({ message: "user password Not updated" });
});

module.exports = {
  createMkUser,
  loginUser,
  updateUserBasedOnNameAndType,
  updatePasswordBasedOnEmail,
  updatePasswordAdmin,
};
