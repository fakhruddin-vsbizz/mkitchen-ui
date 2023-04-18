const expressAsyncHandler = require("express-async-handler");
const MkUser = require("../models/mkUserModel");
const FoodItem = require("../models/foodItemModel");

const addFoodItem = expressAsyncHandler(async (req, res) => {
  const { mkuser_email, name, ingridient_list, usage_counter } = req.body;

  const mkUser = await MkUser.findOne({ email: mkuser_email });

  if (mkUser) {
    const foodItem = await FoodItem.create({
      mkuser_id: mkUser._id,
      name,
      ingridient_list,
      usage_counter,
    });

    if (foodItem) {
      res.status(201).json({ _id: foodItem.id, name: foodItem.name });
    } else {
      res.status(400);
      throw new Error("Error creating the food item");
    }
  }
  res.json({ message: "food item created " });
});

const getFoodItem = expressAsyncHandler(async (req, res) => {
  const foodMenu = await FoodItem.find();
  res.json(foodMenu);
});

module.exports = { addFoodItem, getFoodItem };
