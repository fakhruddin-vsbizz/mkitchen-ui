const expressAsyncHandler = require("express-async-handler");
const MKUser = require("../models/mkUserModel");
const InventoryModel = require("../models/inventoryItemsModel");
const TransectionLogs = require("../models/transectionLogsInventoryModel");
const FoodMenu = require("../models/menuFoodModel");

const addInventoryItems = expressAsyncHandler(async (req, res) => {
  const {
    mkuser_email,
    ingridient_name,
    ingridient_measure_unit,
    ingridient_expiry_period,
    ingridient_expiry_amount,
    decommisioned,
    total_volume,
    price,
    date,
    quantity_transected,
    latest_rate,
    rate_per_unit,
  } = req.body;

  //getting the id's for the respective user
  const mkUser = await MKUser.findOne({ email: mkuser_email });
  // const foodMenu = await FoodMenu.findOne({ date_of_cooking: date });

  if (mkUser) {
    if (
      ingridient_measure_unit === "" ||
      ingridient_expiry_period === "" ||
      ingridient_expiry_amount === "" ||
      ingridient_name === "" ||
      price === ""
    ) {
      return res.status(403).json({ error: "All fields are mendatory" });
    }

    const inventoryItems = await InventoryModel.create({
      mkuser_id: mkUser._id,
      ingridient_name,
      ingridient_measure_unit,
      ingridient_expiry_period,
      ingridient_expiry_amount,
      decommisioned,
      total_volume,
      price,
    });

    if (inventoryItems) {
      return res.status(200).json(inventoryItems);
    }

    // if (inventoryItems) {
    // 	const transectionLogs = await TransectionLogs.create({
    // 		inventory_id: inventoryItems.id,
    // 		food_menu_id: foodMenu._id,
    // 		quantity_transected,
    // 		latest_rate,
    // 		rate_per_unit,
    // 	});

    // 	return res.status(201).json({
    // 		inventory_id: inventoryItems.id,
    // 		// food_menu_id: foodMenu._id,
    // 	});
    // } else {
    // 	res.status(400);
    // 	throw new Error("Error creating the transection log");
    // }
  }
  //   return res.status(201).json({ message: "Delevery review added" });
});

const getInventoryItems = expressAsyncHandler(async (req, res) => {
  const inventory = await InventoryModel.find();
  return res.json(inventory);
});

const updateInventoryItems = expressAsyncHandler(async (req, res) => {
  const { inventory_id, quantity, type } = req.body;

  const inventory = await InventoryModel.findOne({ _id: inventory_id });

  if (type === "udate_volume") {
    const updateIngridient = await InventoryModel.findByIdAndUpdate(
      { _id: Object(inventory._id) },
      { $set: { total_volume: +inventory.total_volume + +quantity } },
      { new: true }
    );
    if (updateIngridient) {
      return res.json({ message: "ingridient list updated successfully" });
    }
  }
  return res.json(inventory);
});

const decommissionOne = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const inventory = await InventoryModel.findOneAndUpdate(
    { _id: id },
    { decommisioned: true }
  );
  if (!inventory) {
    res.status(404);
    throw Error("Not Found");
  }

  return res.json(200);
});

const recommissionOne = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const inventory = await InventoryModel.findOneAndUpdate(
    { _id: id },
    { decommisioned: false }
  );
  if (!inventory) {
    res.status(404);
    throw Error("Not Found");
  }

  return res.json(200);
});

module.exports = {
  addInventoryItems,
  getInventoryItems,
  updateInventoryItems,
  decommissionOne,
  recommissionOne,
};
