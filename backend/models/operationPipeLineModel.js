const mongoose = require("mongoose");

const OperationPipeLine = new mongoose.Schema(
  {
    menu_food_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodMenu",
      required: true,
    },
    ingridient_list: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    status: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

const MenuDeliveryReview = mongoose.model(
  "OperationPipeLine",
  OperationPipeLine
);

module.exports = MenuDeliveryReview;