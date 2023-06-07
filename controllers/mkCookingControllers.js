const expressAsyncHandler = require("express-async-handler");
const Cooking = require("../models/cookingModel");

const getAll = expressAsyncHandler(async (req, res) => {
	const cooking = await Cooking.find({});
	if (!cooking) return res.status(404).json({ msg: "no item in cooking" });

	res.status(200).json({ res: cooking });
});

const getAllForOneDate = expressAsyncHandler(async (req, res) => {
	const { date } = req.body.date;

	const cooking = await Cooking.findOne({date});
	if (!cooking) return res.status(404).json({ msg: "no item in cooking" });

	res.status(200).json({ res: cooking });
});

const createOne = expressAsyncHandler(async (req, res) => {
	const cooking = await Cooking.create(req.body);

	res.status(201).json({ res: cooking });
});

const getOne = expressAsyncHandler(async (req, res) => {
	const { date } = req.body.date;

	const cooking = await Cooking.find({ date });
	if (!cooking)
		return res.status(404).json({ msg: "no item on this date in cooking" });

	res.status(200).json({ res: cooking });
});

const updateOne = expressAsyncHandler(async (req, res) => {
	const { date, data } = req.body.date;
	const cooking = await Cooking.find({ date }, data);
	if (!cooking)
		return res.status(404).json({ msg: "no item on this date in cooking" });
	res.status(200).json({ res: cooking });
});

module.exports = {
	getAll,
	createOne,
	getOne,
	updateOne,
    getAllForOneDate
};
