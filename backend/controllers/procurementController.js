const expressAsyncHandler = require("express-async-handler");
const MenuFood = require("../models/menuFoodModel");
const OperationPipeLine = require("../models/operationPipeLineModel");
const Inventory = require("../models/inventoryItemsModel");

const procumentoryOperation = expressAsyncHandler(async (req, res) => {
	const { menu_id, type, documents } = req.body;

	const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });

	if (type === "get_procure_data") {
		// Get total ashkash count from food_menu collection
		const foodMenu = await MenuFood.findOne({ _id: menu_id });
		const totalAshkashCount = foodMenu.mohalla_wise_ashkhaas.reduce(
			(acc, curr) => acc + curr.total_ashkhaas,
			0
		);

		// Get ingridient_list from OperationalPipeline collection and check inventory
		const inventoryItems = await OperationPipeLine.find({
			menu_food_id: menu_id,
		}).lean();

		const results = await Promise.all(
			inventoryItems[0].ingridient_list.map(async (item, index) => {
				const requiredVolume = +item.perAshkash * +totalAshkashCount;
				const inventory = await Inventory.findById(
					item.inventory_item_id
				).lean();

				const sufficient = inventory.total_volume >= requiredVolume;
				return {
					inventoryItemId: item.inventory_item_id,
					ingridientName: item.ingredient_name,
					total_quantity: +inventory.total_volume - +requiredVolume,
					unit: inventory.ingridient_measure_unit,
					requiredVolume,
					sufficient,
				};
			})
		);

		return res.json(results);
	}

	if (type === "procure_ingridient") {
		// Create an array of write operations to perform in bulk
		const updateInventory = documents.map(inventory => ({
			updateOne: {
				filter: { _id: inventory.inventoryItemId },
				update: {
					$set: {
						total_volume: inventory.total_quantity,
					},
				},
			},
		}));

		// Perform the bulk write operation
		Inventory.bulkWrite(updateInventory)
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.error(error);
			});

		const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
			{ _id: Object(pipeline._id) },
			{ $set: { status: 2 } },
			{ new: true }
		);
		if (updatePipeline) {
			console.log("success");
			return res.json({ message: "pipeline  updated successfully" });
		}
	}
});

module.exports = { procumentoryOperation };
