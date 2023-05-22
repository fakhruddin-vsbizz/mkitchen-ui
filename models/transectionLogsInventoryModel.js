const mongoose = require("mongoose");

const transectionLogs = new mongoose.Schema(
  {
    inventory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MKUser",
      required: true,
    },
    food_menu_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity_transected: {
      type: Number,
      required: true,
    },
    latest_rate: {
      type: Number,
      required: true,
    },
    rate_per_unit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransectionLogs", transectionLogs);
