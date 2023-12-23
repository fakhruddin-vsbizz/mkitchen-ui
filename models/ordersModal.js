const mongoose = require("mongoose");

const ordersModal = new mongoose.Schema(
  {
    mkuser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MKUser",
      required: true,
    },
    ingredient_name: {
      type: String,
      required: true,
    },
    inventory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inventoryItems",
      required: true,
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity_loaded: {
      type: Number,
      required: true,
    },
    rate_per_unit: {
      type: Number,
      required: true,
    },
    deliveryStatus: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

const MenuDeliveryReview = mongoose.model("OrdersModel", ordersModal);

module.exports = MenuDeliveryReview;
