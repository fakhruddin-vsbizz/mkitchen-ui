const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
//user controller

const registerUser = expressAsyncHandler(async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		res.status(400);
		throw new Error("All fields are mendatory");
	}

	const userAvailable = await User.findOne({ email });

	if (userAvailable) {
		res.status(400);
		throw new Error("User Already Register");
	}

	//Hash Password using bcrypt
	const hashPassword = await bcrypt.hash(password, 10);
	console.log("hash password: ", hashPassword);

	const user = await User.create({
		username,
		email,
		password: hashPassword,
	});
	console.log("user created: ", user);

	if (user) {
		return res
			.status(201)
			.json({ _id: user.id, email: user.email, message: "Register user" });
	} else {
		res.status(400);
		throw new Error("Error creating the user");
	}
	// return res.json({ message: "Register user" });
});

const getAllUsers = expressAsyncHandler(async (req, res) => {
	const users = await User.find();
	if (users) {
		return res.status(201).json(users);
	}
});

const loginUser = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400);
		throw new Error("All fields are mendatory");
	}

	const user = await User.findOne({ email });

	//compare password with hash password and generating the token
	if (user && (await bcrypt.compare(password, user.password))) {
		const accessToken = jwt.sign(
			{
				user: {
					username: user.username,
					email: user.email,
					id: user.id,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: "1m",
			}
		);
		return res.status(200).json({ accessToken, message: "Login user" });
	} else {
		res.status(401);
		throw new Error("User dont exists");
	}

	// return res.json({ message: "Login user" });
});

const currentUser = expressAsyncHandler(async (req, res) => {
	return res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser, getAllUsers };
