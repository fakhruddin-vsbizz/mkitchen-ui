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
      default: [],
    },
    dailyMaintenanceCharges: {
      type: Number,
      default: 0,
    },
    gasCharges: {
      type: Number,
      default: 0,
    },
    laborCharges: {
      type: Number,
      default: 0,
    },
    transportCharges: {
      type: Number,
      default: 0,
    },
    micsCharges: {
      type: Number,
      default: 0,
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
