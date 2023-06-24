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
    contact_person: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    phone2: {
      type: String,
    },
    email: {
      type: String,
    },
    email2: {
      type: String,
    },
    gstin: {
      type: String,
    },
    address: {
      type: String,
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
