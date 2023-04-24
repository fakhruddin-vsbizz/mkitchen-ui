const expressAsyncHandler = require("express-async-handler");
const MkUser = require("../models/mkUserModel");
const MenuFood = require("../models/menuFoodModel");

const FoodItem = require("../models/foodItemModel");

const getFoodItemList = expressAsyncHandler(async (req, res) => {
  const { client_name, type, mkuser_id, food_id } = req.body;

  if (type === "get_food_Item") {
    const menuFood = await FoodItem.find({ mkuser_id: mkuser_id });
    if (menuFood) {
      res.status(201).json({ food_list: menuFood });
    } else {
      res.status(400);
      throw new Error("Error getting the food list");
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
});

const updateIngridientList = expressAsyncHandler(async (req, res) => {
  const { food_id, type, ingridient_list } = req.body;

  const foodItem = await FoodItem.findOne({ _id: food_id });

  console.log(foodItem);

  console.log(ingridient_list);
  if (type === "update_food_ingridient" && foodItem) {
    const updateIngridient = await FoodItem.findByIdAndUpdate(
      { _id: Object(foodItem._id) },
      { $set: { ingridient_list: ingridient_list } },
      { new: true }
    );
    if (updateIngridient) {
      res.json({ message: "ingridient list updated successfully" });
    }
  }
});

const getFoodItem = expressAsyncHandler(async (req, res) => {
  const foodMenu = await FoodItem.find();
  res.json(foodMenu);
});

module.exports = { getFoodItemList, getFoodItem, updateIngridientList };
