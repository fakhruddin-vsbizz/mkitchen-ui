const mongoose = require("mongoose");

const purcahsesModel = new mongoose.Schema(
  {
    mkuser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MKUser",
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrdersModels",
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
    used_quantity: {
      type: Number,
      default: 0,
    },
    rate_per_unit: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    total_amount: {
      type: Number,
      required: false,
    },
    expiry_date: {
      type: String,
      required: false,
    },
    invoice_no: {
      type: String,
      required: false,
      default: "n/a",
    },
    date_of_purchase: {
      type: String,
      required: false,
      default: "n/a",
    },
    unshelf: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

const MenuDeliveryReview = mongoose.model("PurchaseModel", purcahsesModel);

module.exports = MenuDeliveryReview;
