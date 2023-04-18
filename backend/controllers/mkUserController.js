const expressAsyncHandler = require("express-async-handler");
const MKUser = require("../models/mkUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createMkUser = expressAsyncHandler(async (req, res) => {
  const { usertype, username, email, password } = req.body;

  if (!usertype || !email || !password || !username) {
    res.status(400);
    throw new Error("All fields are mendatory");
  }

  const userAvailable = await MKUser.findOne({ email });

  if (userAvailable) {
    res.status(400);
    throw new Error("User Already Register");
  }

  //Hash Password using bcrypt
  const hashPassword = await bcrypt.hash(password, 10);
  console.log("hash password: ", hashPassword);

  const user = await MKUser.create({
    usertype,
    username,
    email,
    password: hashPassword,
  });

  console.log("user created: ", user);

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("Error creating the user");
  }
  res.json({ message: "Register user" });
});

const getMkUser = expressAsyncHandler(async (req, res) => {
  const user = await MKUser.find();

  res.json(user);
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
        expiresIn: "1m",
      }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("User does not exist or password is incorrect");
  }
});

module.exports = { createMkUser, getMkUser, loginUser };
