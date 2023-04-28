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
    dispatch
  } = req.body;

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
        res.status(201).json({
          _id: operationPipeLine.id,
          menu_food_id: operationPipeLine.menu_food_id,
        });
      } else {
        res.status(400);
        throw new Error("Error creating the operationPipeLine ");
      }
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

  if (add_type === "get_food_item_id") {
    console.log("getItem id");
    const foodMenu = await FoodItem.findOne({ name: selected_food });
    console.log(foodMenu);
    res.json(foodMenu);
  }
  if (add_type === "get_mohalla_ashkash") {
    const foodMenu = await FoodMenu.findOne({ date_of_cooking: date });
    console.log(foodMenu);
    res.json(foodMenu.mohalla_wise_ashkhaas);
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
  const { data, date_of_cooking } = req.body;

  const foodMenu = await FoodMenu.findOne({ date_of_cooking: date_of_cooking });

  if (foodMenu) {
    const updatedMenuAskash = await FoodMenu.findByIdAndUpdate(
      { _id: Object(foodMenu._id) },
      { $set: { mohalla_wise_ashkhaas: data } },
      { new: true }
    );
    res.json({ users: updatedMenuAskash.mohalla_wise_ashkhaas });
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
