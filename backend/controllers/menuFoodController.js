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
		// Get total ashkash count from food_menu collection
		console.log("here here===>", menu_id);

		const foodMenu = await FoodMenu.findOne({ _id: menu_id });
		console.log("menu", foodMenu);

		const totalAshkashCount = foodMenu.mohalla_wise_ashkhaas.reduce(
			(acc, curr) => acc + curr.total_ashkhaas,
			0
		);
		console.log("total: ", totalAshkashCount);
		return res.json(totalAshkashCount);
	}

	if (add_type === "add_menu") {
		console.log("adding menu");
		console.log(
			food_list,
			total_ashkhaas,
			module,
			date_of_cooking,
			client_name,
			jaman_coming,
			reason_for_undelivered
		);
		const foodMenu = await FoodMenu.create({
			food_list,
			total_ashkhaas,
			mohalla_wise_ashkhaas,
			date_of_cooking,
			client_name,
			jaman_coming,
			reason_for_undelivered,
		});

		if (foodMenu) {
			const operationPipeLine = await OperationPipeLine.create({
				menu_food_id: foodMenu._id,
				ingridient_list,
				reorder_logs,
				dispatch,
				status,
			});

			if (operationPipeLine) {
				return res.status(201).json({
					_id: operationPipeLine.id,
					menu_food_id: operationPipeLine.menu_food_id,
					message: "menu created ",
				});
			} else {
				res.status(400);
				throw new Error("Error creating the operationPipeLine ");
			}
		} else {
			res.status(400);
			throw new Error("Error creating the menu");
		}
		// return res.json({ message: "menu created " });
	}

	if (add_type === "food_item") {
		console.log("adding item");

		const mkUser = await MkUser.findOne({ email: mkuser_email });

		console.log(mkUser);
		console.log(food_name, ingridient_list, usage_counter);
		if (mkUser) {
			console.log("inside mk");
			const foodItem = await FoodItem.create({
				mkuser_id: mkUser._id,
				name: food_name,
				ingridient_list,
				usage_counter,
			});

			if (foodItem) {
				console.log("created");
				return res.status(201).json({ _id: foodItem.id, name: foodItem.name });
			} else {
				res.status(400);
				throw new Error("Error creating the food item");
			}
		}
	}

	if (add_type === "get_food_item") {
		console.log("getItem");
		const foodMenu = await FoodItem.find();
		return res.json(foodMenu);
	}

	if (add_type === "get_food_item_id") {
		console.log("getItem id");
		const foodMenu = await FoodItem.findOne({ name: selected_food });
		console.log(foodMenu);
		return res.json(foodMenu);
	}
	if (add_type === "get_mohalla_ashkash") {
		const foodMenu = await FoodMenu.findOne({ date_of_cooking: date });
		console.log(foodMenu);
		return res.json(foodMenu.mohalla_wise_ashkhaas);
	}
});

const getFoodMenu = expressAsyncHandler(async (req, res) => {
	const { data_type } = req.body;
	if (data_type === "food_menu") {
		const foodMenu = await FoodMenu.find();
		return res.json(foodMenu);
	}
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
};
