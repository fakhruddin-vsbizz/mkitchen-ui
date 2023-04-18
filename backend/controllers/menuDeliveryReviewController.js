const expressAsyncHandler = require("express-async-handler");
const MKUser = require("../models/mkUserModel");
const FoodMenu = require("../models/menuFoodModel");
const MenuDelivery = require("../models/menuDeliveryReviewModel");

const addDeliveryReview = expressAsyncHandler(async (req, res) => {
  const { mkuser_email, menu_food_client_name, review, remark } = req.body;

  //getting the id's for the respective user
  const mkUser = await MKUser.findOne({ email: mkuser_email });
  const menuFood = await FoodMenu.findOne({
    client_name: menu_food_client_name,
  });

  if (mkUser && menuFood) {
    const deliveryReview = await MenuDelivery.create({
      mkuser_id: mkUser._id,
      menu_food_id: menuFood._id,
      review,
      remark,
    });

    if (deliveryReview) {
      res
        .status(201)
        .json({ _id: deliveryReview.id, review: deliveryReview.review });
    } else {
      res.status(400);
      throw new Error("Error creating the delevery review");
    }
  }
  res.json({ message: "Delevery review added" });
});

const getDeliveryReview = expressAsyncHandler(async (req, res) => {
  const menuDelivery = await MenuDelivery.find();
  res.json(menuDelivery);
});

module.exports = { addDeliveryReview, getDeliveryReview };
