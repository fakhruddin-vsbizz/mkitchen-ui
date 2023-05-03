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

    //doc
    documents,
  } = req.body;

  console.log(documents);
  // Create an array of write operations to perform in bulk
  const ops = documents.map((doc) => ({
    insertOne: { document: doc },
  }));

  // Perform the bulk write operation
  Purchase.bulkWrite(ops)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });

  // Create an array of write operations to perform in bulk
  const updateInventory = documents.map((inventory) => ({
    updateOne: {
      filter: { _id: inventory.inventory_id },
      update: {
        $inc: {
          total_volume: inventory.quantity_loaded,
        },
      },
    },
  }));
  console.log(updateInventory);

  // Perform the bulk write operation
  InventoryModel.bulkWrite(updateInventory)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });

  res.json({ message: "Purchase added" });
});

const getPurchase = expressAsyncHandler(async (req, res) => {
  const purchase = await Purchase.find();
  res.json(purchase);
});

module.exports = { addPurchase, getPurchase };
