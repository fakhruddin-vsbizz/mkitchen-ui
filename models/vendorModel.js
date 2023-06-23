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
    phone: {
      type: String,
      required: true,
    },
    phone2: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    email2: {
      type: String,
      required: true,
    },
    gstin: {
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
