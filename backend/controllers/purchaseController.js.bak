const expressAsyncHandler = require("express-async-handler");
const MKUser = require("../models/mkUserModel");
const Vendor = require("../models/vendorModel");
const Purchase = require("../models/purchasesModel");
const InventoryModel = require("../models/inventoryItemsModel");

const addPurchase = expressAsyncHandler(async (req, res) => {
	const {
		mkuser_email,
		ingridient_name,
		vendor_email,
		quantity_loaded,
		rate_per_unit,

		//doc
		documents,
	} = req.body;

	console.log(documents);
	// Create an array of write operations to perform in bulk
	const ops = documents.map(doc => ({
		insertOne: { document: doc },
	}));

	// Perform the bulk write operation
	Purchase.bulkWrite(ops)
		.then(result => {
			console.log(result);
		})
		.catch(error => {
			console.error(error);
		});

	// Create an array of write operations to perform in bulk
	const updateInventory = documents.map(inventory => ({
		updateOne: {
			filter: { _id: inventory.inventory_id },
			update: {
				$inc: {
					total_volume: inventory.quantity_loaded,
				},
			},
		},
	}));
	console.log(updateInventory);

	// Perform the bulk write operation
	InventoryModel.bulkWrite(updateInventory)
		.then(result => {
			console.log(result);
		})
		.catch(error => {
			console.error(error);
		});

	return res.json({ message: "Purchase added" });
});

const getPurchase = expressAsyncHandler(async (req, res) => {
	console.log("hitting");
	const purchase = await Purchase.find();
	return res.json(purchase);
});

const unShelfItem = expressAsyncHandler(async (req, res) => {
	const { id } = req.params;
	const purchase = await Purchase.findOneAndDelete({ _id: id });

	if (!purchase) {
		res.status(404);
		throw Error("Item Not Found");
	}

	return res.status(200);
});

const getPurchaseWithExpiry = expressAsyncHandler(async (req, res) => {
	console.log("hitting");
	const purchase = await Purchase.find().exec();
	const inventory = await InventoryModel.find();

	const newPurchase = purchase
		.map(item => {
			const expiryData = inventory.filter(
				newItem => newItem._id.toString() === item.inventory_id.toString()
			)[0];

			let date = new Date();

			switch (expiryData.ingridient_expiry_period) {
				case "Days":
					date = new Date(item.createdAt);
					date.setDate(
						date.getDate() + parseInt(expiryData.ingridient_expiry_amount)
					);

					break;
				case "Months":
					date = new Date(item.createdAt);
					date.setMonth(
						date.getMonth() + parseInt(expiryData.ingridient_expiry_amount)
					);
					break;
				case "Year":
					date = new Date(item.createdAt);
					date.setYear(
						date.getYear() + parseInt(expiryData.ingridient_expiry_amount)
					);
					break;

				default:
					break;
			}

			return {
				...item._doc,
				expiryDate: date,
			};
		})
		.filter(item => new Date(item.expiryDate) < new Date());

	return res.status(200).json(newPurchase);
});

module.exports = {
	addPurchase,
	getPurchase,
	getPurchaseWithExpiry,
	unShelfItem,
};
