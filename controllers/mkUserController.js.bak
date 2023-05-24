const expressAsyncHandler = require("express-async-handler");
const MKUser = require("../models/mkUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createMkUser = expressAsyncHandler(async (req, res) => {
	const { usertype, username, email, password, action } = req.body;

	if (action === "create_mk") {
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

	const user = await MKUser.findOne({ username, usertype });
	console.log(username, usertype, action, email, password);

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

module.exports = {
	createMkUser,
	loginUser,
	updateUserBasedOnNameAndType,
};
