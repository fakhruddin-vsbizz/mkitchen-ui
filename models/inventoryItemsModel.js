const mongoose = require("mongoose");

const InventoryItems = mongoose.Schema(
  {
    mkuser_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ingridient_name: {
      type: String,
      required: true,
    },
    ingridient_measure_unit: {
      type: String,
      default: ""
    },
    ingridient_expiry_period: {
      type: String,
      required: true,
    },
    ingridient_expiry_amount: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    decommisioned: {
      type: Boolean,
      required: true,
    },
    total_volume: {
      type: Number,
      required: true,
      set: function (v) { return Number(v.toFixed(3))}
    },
    baseline: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryItems", InventoryItems);
