const expressAsyncHandler = require("express-async-handler");
const MKUser = require("../models/mkUserModel");
const Vendor = require("../models/vendorModel");
const Purchase = require("../models/purchasesModel");
const InventoryModel = require("../models/inventoryItemsModel");

const addPurchase = expressAsyncHandler(async (req, res) => {
  const {
    mkuser_email,
    ingridient_name,
    vendor_email,
    quantity_loaded,
    rate_per_unit,
  } = req.body;

  //getting the id's for the respective user
  const mkUser = await MKUser.findOne({ email: mkuser_email });
  const ingridientItem = await InventoryModel.findOne({
    ingridient_name: ingridient_name,
  });

  const vendorId = await Vendor.findOne({
    email: vendor_email,
  });

  if (mkUser && ingridientItem && vendorId) {
    const purchase = await Purchase.create({
      mkuser_id: mkUser._id,
      inventory_id: ingridientItem._id,
      vendor_id: vendorId._id,
      quantity_loaded,
      rate_per_unit,
    });

    if (purchase) {
      res.status(201).json({ _id: purchase.id, vendor_id: purchase.vendor_id });
    } else {
      res.status(400);
      throw new Error("Error creating the purchase");
    }
  }
  res.json({ message: "Purchase added" });
});

const getPurchase = expressAsyncHandler(async (req, res) => {
  const purchase = await Purchase.find();
  res.json(purchase);
});

module.exports = { addPurchase, getPurchase };
