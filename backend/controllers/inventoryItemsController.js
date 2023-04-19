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
    date,
    quantity_transected,
    latest_rate,
    rate_per_unit,
  } = req.body;

  //getting the id's for the respective user
  const mkUser = await MKUser.findOne({ email: mkuser_email });
  const foodMenu = await FoodMenu.findOne({ date_of_cooking: date });

  if (mkUser && foodMenu) {
    const inventoryItems = await InventoryModel.create({
      mkuser_id: mkUser._id,
      ingridient_name,
      ingridient_measure_unit,
      ingridient_expiry_period,
      ingridient_expiry_amount,
      decommisioned,
      total_volume,
    });

    if (inventoryItems) {
      const transectionLogs = await TransectionLogs.create({
        inventory_id: inventoryItems.id,
        food_menu_id: foodMenu._id,
        quantity_transected,
        latest_rate,
        rate_per_unit,
      });

      res.status(201).json({
        inventory_id: inventoryItems.id,
        food_menu_id: foodMenu._id,
      });
    } else {
      res.status(400);
      throw new Error("Error creating the delevery review");
    }
  }
  res.json({ message: "Delevery review added" });
});

const getInventoryItems = expressAsyncHandler(async (req, res) => {
  const InventoryModel = await InventoryModel.find();
  res.json(InventoryModel);
});

module.exports = { addInventoryItems, getInventoryItems };
