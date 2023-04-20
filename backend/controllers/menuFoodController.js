const expressAsyncHandler = require("express-async-handler");
const FoodMenu = require("../models/menuFoodModel");
const MkUser = require("../models/mkUserModel");
const FoodItem = require("../models/foodItemModel");

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
  } = req.body;

  if (add_type === "add_menu") {
    console.log("adding menu");
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
      res
        .status(201)
        .json({ _id: foodMenu.id, client_name: foodMenu.client_name });
    } else {
      res.status(400);
      throw new Error("Error creating the menu");
    }
    res.json({ message: "menu created " });
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
        res.status(201).json({ _id: foodItem.id, name: foodItem.name });
      } else {
        res.status(400);
        throw new Error("Error creating the food item");
      }
    }
  }

  if (add_type === "get_food_item") {
    console.log("getItem");
    const foodMenu = await FoodItem.find();
    res.json(foodMenu);
  }
});

const getFoodMenu = expressAsyncHandler(async (req, res) => {
  const { data_type } = req.body;
  if (data_type === "food_menu") {
    const foodMenu = await FoodMenu.find();
    res.json(foodMenu);
  }
});

const updateFoodMenuAskahs = expressAsyncHandler(async (req, res) => {
  const { total_ashkhaas, date_of_cooking } = req.body;

  const foodMenu = await FoodMenu.findOne({ date_of_cooking: date_of_cooking });

  if (foodMenu) {
    const updatedMenuAskash = await FoodMenu.findByIdAndUpdate(
      { _id: Object(foodMenu._id) },
      { $set: { total_ashkhaas: total_ashkhaas } },
      { new: true }
    );
    res.json({ total_ashkhaas: updatedMenuAskash.total_ashkhaas });
  }
});

const getMenuBasedOnDate = expressAsyncHandler(async (req, res) => {
  const { date } = req.body;

  const foodMenu = await FoodMenu.find({ date_of_cooking: date });
  if (foodMenu) {
    res.json(foodMenu);
  }
});

module.exports = {
  addFoodMenu,
  getFoodMenu,
  updateFoodMenuAskahs,
  getMenuBasedOnDate,
};
