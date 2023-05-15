const expressAsyncHandler = require("express-async-handler");
const FoodMenu = require("../models/menuFoodModel");
const MkUser = require("../models/mkUserModel");
const FoodItem = require("../models/foodItemModel");
const OperationPipeLine = require("../models/operationPipeLineModel");

const addFoodMenu = expressAsyncHandler(async (req, res) => {
	const {
		//food item req data

		mkuser_email,
		food_name,
		ingridient_list,
		usage_counter,

		//menu req data
		food_list,
		total_ashkhaas,
		date_of_cooking,
		client_name,
		jaman_coming,
		reason_for_undelivered,
		mohalla_wise_ashkhaas,
		add_type,

		//food id req data
		selected_food,

		//mohalla wise ashkash req data
		date,

		//operation pipeline req data
		reorder_logs,
		status,
		dispatch,

		//get the mohalla wise count
		menu_id,
	} = req.body;

	if (add_type === "get_total_ashkash_sum") {
		const foodMenu = await FoodMenu.findOne({ _id: menu_id });

		const totalAshkashCount = foodMenu.mohalla_wise_ashkhaas.reduce(
			(acc, curr) => acc + curr.total_ashkhaas,
			0
		);

		return res.json(totalAshkashCount);
	}

	if (add_type === "get_mohalla_ashkash") {
		const foodMenu = await FoodMenu.findOne({ date_of_cooking: date });
		console.log(foodMenu);
		return res.json(foodMenu);
	}
});

const getFoodMenu = expressAsyncHandler(async (req, res) => {
	const { data_type } = req.body;
	if (data_type === "food_menu") {
		const foodMenu = await FoodMenu.find();
		return res.json(foodMenu);
	}
});

const getFoodItem = expressAsyncHandler(async (req, res) => {
	const foodMenu = await FoodItem.find();
	return res.json(foodMenu);
});

const getItemId = expressAsyncHandler(async (req, res) => {
	const foodMenu = await FoodItem.findOne({ name: req.body.selected_food });
	return res.json(foodMenu);
});

const addMenu = expressAsyncHandler(async (req, res) => {
	const {
		food_list,
		total_ashkhaas,
		mohalla_wise_ashkhaas,
		date_of_cooking,
		client_name,
		jaman_coming,
		reason_for_undelivered,
		ingridient_list,
		reorder_logs,
		dispatch,
		status,
	} = req.body;

	let foodMenu = await FoodMenu.findOne({ date_of_cooking });
	if (!foodMenu) {
		foodMenu = await FoodMenu.create({
			food_list,
			total_ashkhaas,
			mohalla_wise_ashkhaas,
			date_of_cooking,
			client_name,
			jaman_coming,
			reason_for_undelivered,
		});
	} else {
		await FoodMenu.findOneAndUpdate(
			{ date_of_cooking },
			{
				food_list,
				total_ashkhaas,
				mohalla_wise_ashkhaas,
				date_of_cooking,
				client_name,
				jaman_coming,
				reason_for_undelivered,
			},
			{ upsert: true }
		);
	}

	if (!foodMenu) {
		res.status(400);
		throw new Error("Error creating the menu");
	}

	const operationPipeLine = await OperationPipeLine.create({
		menu_food_id: foodMenu._id,
		ingridient_list,
		reorder_logs,
		dispatch,
		status,
	});

	if (!operationPipeLine) {
		res.status(400);
		throw new Error("Error creating the operationPipeLine ");
	}
	return res.status(201).json({
		_id: operationPipeLine.id,
		menu_food_id: operationPipeLine.menu_food_id,
		message: "menu created ",
	});
	// return res.json({ message: "menu created " });
});

const createFoodItem = expressAsyncHandler(async (req, res) => {
	const { mkuser_email, food_name, ingridient_list, usage_counter } = req.body;

	const mkUser = await MkUser.findOne({ email: mkuser_email });

	if (!mkUser) {
		res.status(400);
		throw new Error("Error user not found");
	}

	if (!foodItem) {
		res.status(400);
		throw new Error("Error creating the food item");
	}

	const foodItem = await FoodItem.create({
		mkuser_id: mkUser._id,
		name: food_name,
		ingridient_list,
		usage_counter,
	});

	return res.status(201).json({ _id: foodItem.id, name: foodItem.name });
});

const updateFoodMenuAskahs = expressAsyncHandler(async (req, res) => {
	const { data, date_of_cooking } = req.body;

	const foodMenu = await FoodMenu.findOne({ date_of_cooking: date_of_cooking });

	if (foodMenu) {
		console.log("data: ", data);
		// const updatedMenuAskash = await FoodMenu.findByIdAndUpdate(
		//   { _id: Object(foodMenu._id) },
		//   { $set: { mohalla_wise_ashkhaas: data } },
		//   { new: true }
		// );

		const existingMkIds = foodMenu.mohalla_wise_ashkhaas.map(
			item => item.mk_id
		);
		const operations = data.map(item => {
			if (existingMkIds.includes(item.mk_id)) {
				// update existing object in array
				return {
					updateOne: {
						filter: {
							_id: Object(foodMenu._id),
							"mohalla_wise_ashkhaas.mk_id": item.mk_id,
						},
						update: {
							$set: {
								"mohalla_wise_ashkhaas.$.total_ashkhaas": item.total_ashkhaas,
							},
						},
					},
				};
			} else {
				// add new object to array
				return {
					updateOne: {
						filter: { _id: Object(foodMenu._id) },
						update: {
							$push: {
								mohalla_wise_ashkhaas: {
									mk_id: item.mk_id,
									name: item.name,
									total_ashkhaas: item.total_ashkhaas,
								},
							},
						},
						upsert: true,
					},
				};
			}
		});

		console.log("op: ", operations);

		// Execute the bulk update operation
		FoodMenu.bulkWrite(operations)
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.error(error);
			});

		console.log("result: ", result);
		return res.status(200).send("Data upserted successfully");
	}
});

const getMenuBasedOnDate = expressAsyncHandler(async (req, res) => {
	const { date } = req.body;

	const foodMenu = await FoodMenu.find({ date_of_cooking: date });
	if (foodMenu) {
		return res.json(foodMenu);
	}
});

module.exports = {
	addFoodMenu,
	getFoodMenu,
	updateFoodMenuAskahs,
	getMenuBasedOnDate,
	getFoodItem,
	getItemId,
	createFoodItem,
	addMenu,
};
