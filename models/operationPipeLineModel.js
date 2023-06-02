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
    reorder_logs: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    dispatch: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    leftover: {
      type: mongoose.Schema.Types.Mixed,
      default: []
    },
    status: {
      type: Number,
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
