const expressAsyncHandler = require("express-async-handler");
const MKUser = require("../models/mkUserModel");
const FoodMenu = require("../models/menuFoodModel");
const MenuDelivery = require("../models/menuDeliveryReviewModel");

const addDeliveryReview = expressAsyncHandler(async (req, res) => {
  const {
    mkuser_email,
    date_of_cooking,
    review,
    remark,
    username,
    //get review
    type,
    menu_id,
  } = req.body;

  if (type === "add_review") {
    //getting the id's for the respective user
    const mkUser = await MKUser.findOne({ email: mkuser_email });
    const menuFood = await FoodMenu.findOne({
      date_of_cooking: date_of_cooking,
    });

    if (mkUser && menuFood) {
      const deliveryReview = await MenuDelivery.create({
        mkuser_id: mkUser._id,
        menu_food_id: menuFood._id,
        username,
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
  }

  if (type === "get_review") {
    const { menu_id } = req.body;
    const menuDelivery = await MenuDelivery.find({ menu_food_id: menu_id });
    res.json(menuDelivery);
  }
});

const getDeliveryReview = expressAsyncHandler(async (req, res) => {
  const menuDelivery = await MenuDelivery.find();
  res.json(menuDelivery);
});

module.exports = { addDeliveryReview, getDeliveryReview };
