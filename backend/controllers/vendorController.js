const expressAsyncHandler = require("express-async-handler");
const MkUser = require("../models/mkUserModel");
const VendorModel = require("../models/vendorModel");

const addVendor = expressAsyncHandler(async (req, res) => {
  const {
    mkuser_email,
    vendor_name,
    opening_time,
    closing_time,
    email,
    address,
    mkuser_id,
    approval_status,
  } = req.body;

  const mkUser = await MkUser.findOne({ email: mkuser_email });

  if (mkUser) {
    const vendor = await VendorModel.create({
      mkuser_id: mkUser._id,
      vendor_name,
      opening_time,
      closing_time,
      email,
      address,
      approval_status,
    });

    if (vendor) {
      res.status(201).json({ _id: vendor.id, name: vendor.vendor_name });
    } else {
      res.status(400);
      throw new Error("Error creating the Vendor");
    }
  }
  res.json({ message: "vendor created " });
});

const getVendor = expressAsyncHandler(async (req, res) => {
  const vendor = await VendorModel.find();
  res.json(vendor);
});

const updateVendor = expressAsyncHandler(async (req, res) => {
  const { type, approval_status, vendor_id } = req.body;

  const vendorData = await VendorModel.findOne({ _id: vendor_id });

  if (type === "update_status") {
    console.log("in here");
    const updateVendorStatus = await VendorModel.findByIdAndUpdate(
      { _id: Object(vendorData._id) },
      { $set: { approval_status: approval_status } },
      { new: true }
    );
    if (updateVendorStatus) {
      res.json(updateVendorStatus);
    }
  }
});

module.exports = { addVendor, getVendor, updateVendor };
