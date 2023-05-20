const expressAsyncHandler = require("express-async-handler");
const MkUser = require("../models/mkUserModel");
const VendorModel = require("../models/vendorModel");
const Purchase = require("../models/purchasesModel");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
    if (
      address === "" ||
      email === "" ||
      vendor_name === "" ||
      closing_time === "" ||
      opening_time === ""
    ) {
      return res.status(403).json({ inputInvalid: "All Fields Are Mendatory" });
    }

    if (emailRegex.test(email) !== true) {
      return res
        .status(403)
        .json({ emailInvalid: "Please write correct email!!" });
    }
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
      return res.status(201).json({ _id: vendor.id, name: vendor.vendor_name });
    } else {
      res.status(400);
      throw new Error("Error creating the Vendor");
    }
  }
  return res.json({ message: "vendor created " });
});

const getVendor = expressAsyncHandler(async (req, res) => {
  const vendor = await VendorModel.find();
  return res.json(vendor);
});

const getVendorPurchaseWithOrderHistory = expressAsyncHandler(
  async (req, res) => {
    const data = await Purchase.aggregate([
      {
        $lookup: {
          from: "vendormodels",
          localField: "vendor_id",
          foreignField: "_id",
          as: "vendorInfo",
        },
      },
      //to create the seperate document
      {
        $unwind: "$vendorInfo",
      },
      {
        $group: {
          _id: "$vendorInfo",
          totalOrders: { $sum: 1 },
          totalCost: { $sum: "$total_amount" },
        },
      },
      {
        $project: {
          _id: 0,
          vendorName: "$_id.vendor_name",
          vendorId: "$_id._id",
          totalOrders: 1,
          totalCost: 1,
          approval_status: "$_id.approval_status",
        },
      },
    ]);

    res.status(200).json(data);
  }
);

const getTotalVendorPurchase = expressAsyncHandler(async (req, res) => {
  try {
    const data = await VendorModel.aggregate([
      {
        $lookup: {
          from: "purchasemodels",
          localField: "_id",
          foreignField: "vendor_id",
          as: "purchaseInfo",
        },
      },
      {
        $project: {
          vendor_name: "$vendor_name",
          totalPurchases: { $size: "$purchaseInfo" },
          approval_status: "$approval_status",
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateVendor = expressAsyncHandler(async (req, res) => {
  const { type, approval_status, vendor_id } = req.body;

  const vendorData = await VendorModel.findOne({ _id: vendor_id });

  if (type === "update_status") {
    const updateVendorStatus = await VendorModel.findByIdAndUpdate(
      { _id: Object(vendorData._id) },
      { $set: { approval_status: approval_status } },
      { new: true }
    );
    if (updateVendorStatus) {
      return res.json(updateVendorStatus);
    }
  }
});

module.exports = {
  addVendor,
  getVendor,
  updateVendor,
  getVendorPurchaseWithOrderHistory,
  getTotalVendorPurchase,
};
