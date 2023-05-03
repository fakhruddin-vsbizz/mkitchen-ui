const expressAsyncHandler = require("express-async-handler");
const MkUser = require("../models/mkUserModel");
const MenuFood = require("../models/menuFoodModel");
const InventoryModel = require("../models/inventoryItemsModel");
const OperationPipeLine = require("../models/operationPipeLineModel");
const { ObjectId } = require("mongodb");

const FoodItem = require("../models/foodItemModel");

const getFoodItemList = expressAsyncHandler(async (req, res) => {
  const { client_name, type, mkuser_id, food_id, date } = req.body;

  const foodItemIds = req.body.food_item_ids;
  const typeDF = req.body.type;

  if (typeDF === "get_food_and_ingridient") {
    // Convert the food item IDs to ObjectId format
    const objectIds = foodItemIds.map((id) => new ObjectId(id.food_item_id));
    console.log(objectIds);
    // Retrieve the ingredient list for the given food item IDs from the food_item collection
    FoodItem.find({ _id: { $in: objectIds } })
      .then((foodItems) => {
        console.log(foodItems);
        // Extract the ingredient lists from the retrieved food items
        const ingredientLists = foodItems.map(
          (foodItem) => foodItem.ingridient_list
        );

        // Send the ingredient lists back to the client
        res.json(ingredientLists);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      });
  }

  if (type === "get_food_Item") {
    console.log("touched");
    const menuFood = await MenuFood.find({ date_of_cooking: date });
    if (menuFood) {
      res.status(201).json(menuFood);
    } else {
      res.status(400);
      throw new Error("Error getting the food list");
    }
  }

  if (type === "get_mohalla_users") {
    const menuFood = await MenuFood.find({ date_of_cooking: date });
    if (menuFood) {
      res.status(201).json(menuFood);
    } else {
      res.status(400);
      throw new Error("Error getting the mohalla users");
    }
  }

  if (type === "get_user_id") {
    const mkuser = await MkUser.findOne({ username: client_name });
    if (mkuser) {
      res.status(201).json({ user: mkuser._id });
    } else {
      res.status(400);
      throw new Error("Error getting the user");
    }
  }
  if (type === "get_food_ingridients") {
    const foodItem = await FoodItem.findOne({ _id: food_id });

    if (foodItem) {
      res.status(201).json({ ingridient_data: foodItem.ingridient_list });
    } else {
      res.status(400);
      throw new Error("Error getting the food ingridient");
    }
  }

  if (type === "get_inventory_ingridients") {
    const inventory = await InventoryModel.find();
    res.json(inventory);
  }
});

const updateIngridientList = expressAsyncHandler(async (req, res) => {
  const { food_id, type, ingridient_list, menu_id, reorder_logs, status } =
    req.body;

  const foodItem = await FoodItem.findOne({ _id: food_id });
  const operationId = await OperationPipeLine.findOne({
    menu_food_id: menu_id,
  });

  if (type === "update_food_ingridient" && foodItem) {
    console.log("update ingridients of food items");

    const updateIngridient = await FoodItem.findByIdAndUpdate(
      { _id: Object(foodItem._id) },
      { $set: { ingridient_list: ingridient_list } },
      { new: true }
    );
    if (updateIngridient) {
      res.json({ message: "ingridient list updated successfully" });
    }
  }

  if (type === "update_operation_pipeline_ingridient_list") {
    const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
      { _id: Object(operationId._id) },
      { $set: { ingridient_list: ingridient_list } },
      { new: true }
    );

    const updatePipelineStatus = await OperationPipeLine.findByIdAndUpdate(
      { _id: Object(operationId._id) },
      { $set: { status: status } },
      { new: true }
    );

    if (updatePipeline && updatePipelineStatus) {
      console.log("success");
      res.json({ message: "pipeline  updated successfully" });
    }
  }

  if (type === "update_operation_pipeline_reorder_logs") {
    const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
      { _id: Object(operationId._id) },
      { $set: { reorder_logs: reorder_logs } },
      { new: true }
    );
    if (updatePipeline) {
      console.log("success");
      res.json({ message: "pipeline  updated successfully" });
    }
  }
});

const getFoodItem = expressAsyncHandler(async (req, res) => {
  const foodMenu = await FoodItem.find();
  res.json(foodMenu);
});

module.exports = { getFoodItemList, getFoodItem, updateIngridientList };
