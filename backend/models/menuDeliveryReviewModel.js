const mongoose = require("mongoose");

const menuDeliveryReviewSchema = new mongoose.Schema(
  {
    mkuser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MKUser",
      required: true,
    },
    menu_food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuFood",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    review: {
      type: Number,
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MenuDeliveryReview = mongoose.model(
  "MenuDeliveryReview",
  menuDeliveryReviewSchema
);

module.exports = MenuDeliveryReview;
