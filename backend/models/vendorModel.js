const mongoose = require("mongoose");
const vendorModel = new mongoose.Schema(
  {
    mkuser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MKUser",
      required: true,
    },
    vendor_name: {
      type: String,
      required: true,
    },
    opening_time: {
      type: String,
      required: true,
    },
    closing_time: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    approval_status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const MenuDeliveryReview = mongoose.model("VendorModel", vendorModel);

module.exports = MenuDeliveryReview;
