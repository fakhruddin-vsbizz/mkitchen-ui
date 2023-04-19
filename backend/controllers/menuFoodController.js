const expressAsyncHandler = require("express-async-handler");
const FoodMenu = require("../models/menuFoodModel");

const addFoodMenu = expressAsyncHandler(async (req, res) => {
  const {
    food_list,
    total_ashkhaas,
    date_of_cooking,
    client_name,
    jaman_coming,
    reason_for_undelivered,
    mohalla_wise_ashkhaas,
  } = req.body;

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
});

const getFoodMenu = expressAsyncHandler(async (req, res) => {
  const foodMenu = await FoodMenu.find();
  res.json(foodMenu);
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
