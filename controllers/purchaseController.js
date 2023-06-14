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

  //validation and error handling
  if (documents.length === 0) {
    return res.status(403).json({ error: "please add items" });
  }
  documents.forEach((element) => {
    if (
      element.quantity_loaded === undefined ||
      element.rate_per_unit === undefined ||
      element.vendor_id === undefined
    ) {
      return res.status(403).json({ fieldError: "please add all the fields" });
    }
  });
  // Create an array of write operations to perform in bulk
  const ops = documents.map((doc) => ({
    insertOne: { document: doc },
  }));

  // Perform the bulk write operation
  await Purchase.bulkWrite(ops)
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

  // Perform the bulk write operation
  await InventoryModel.bulkWrite(updateInventory)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });

  return res.json({ message: "Purchase added" });
});

const getVendorWisePurchase = expressAsyncHandler(async (req, res) => {
  // const purchase = await Purchase.find();

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
      $project: {
        _id: 1,
        vendor_id: 1,
        mkuser_id: 1,
        ingredient_name: 1,
        quantity_loaded: 1,
        rate_per_unit: 1,
        createdAt: 1,
        updatedAt: 1,
        paid: 1,
        total_amount: 1,
        expiry_date: 1,
        unshelf: 1,
        vendorName: "$vendorInfo.vendor_name",
      },
    },
  ]);

  const totalAmountSum = data.reduce((sum, item) => sum + item.total_amount, 0);
  const arrayLength = data.length;

  return res
    .status(200)
    .json({ data, totalAmountSum, totalPurchases: arrayLength });
});

const getPurchase = expressAsyncHandler(async (req, res) => {
  const purchase = await Purchase.find();
  if (!purchase) {
    return res.status(404).json({ error: "No purchase found" });
  }

  return res.status(200).json(purchase);
});

const getExpiredInventoryItems = expressAsyncHandler(async (req, res) => {
  try {
    const { date } = req.body;
    const parsedDate = new Date(date);

    // const purchases = await Purchase.find({ unshelf: false });
    const purchases = await Purchase.aggregate([
      {
        $match: { unshelf: false }
      },
      {
        $lookup: {
          from: "inventoryitems",
          localField: "inventory_id",
          foreignField: "_id",
          as: "inventoryInfo",
        },
      }
    ]);
    console.log(purchases);

    const filteredPurchases = purchases.filter((purchase) => {
      const [month, day, year] = purchase.expiry_date.split("/");
      const expiryDate = new Date(`${month}/${day}/20${year}`);
      return expiryDate < parsedDate;
    });


    return res.status(200).json(filteredPurchases);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});

const updatePaidStatusPurchase = expressAsyncHandler(async (req, res) => {
  const { purchase_id, paid } = req.body;

  const updatePaidStatus = await Purchase.findByIdAndUpdate(
    { _id: Object(purchase_id) },
    { $set: { paid: paid } },
    { new: true }
  );
  if (updatePaidStatus) {
    return res.status(200).json({ message: "status updated successfully" });
  } else {
    return res.status(404).json({ error: "status not updated " });
  }
});

const updateShelfStatus = expressAsyncHandler(async (req, res) => {
  const { purchase_id, shelf } = req.body;

  const updateShelf = await Purchase.findByIdAndUpdate(
    { _id: Object(purchase_id) },
    { $set: { unshelf: shelf } },
    { new: true }
  );
  if (updateShelf) {
    return res.status(200).json({ message: "shelf updated successfully" });
  } else {
    return res.status(404).json({ error: "shelf not updated " });
  }
});

const unShelfItem = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const purchase = await Purchase.findOneAndDelete({ _id: id });

  if (!purchase) {
    res.status(404);
    throw Error("Item Not Found");
  }

  return res.status(200);
});

const getPurchaseWithExpiry = expressAsyncHandler(async (req, res) => {
  const purchase = await Purchase.find().exec();
  const inventory = await InventoryModel.find();

  const newPurchase = purchase
    .map((item) => {
      const expiryData = inventory.filter(
        (newItem) => newItem._id.toString() === item.inventory_id.toString()
      )[0];

      let date = new Date();

      switch (expiryData.ingridient_expiry_period) {
        case "Days":
          date = new Date(item.createdAt);
          date.setDate(
            date.getDate() + parseInt(expiryData.ingridient_expiry_amount)
          );

          break;
        case "Months":
          date = new Date(item.createdAt);
          date.setMonth(
            date.getMonth() + parseInt(expiryData.ingridient_expiry_amount)
          );
          break;
        case "Year":
          date = new Date(item.createdAt);
          date.setYear(
            date.getYear() + parseInt(expiryData.ingridient_expiry_amount)
          );
          break;

        default:
          break;
      }

      return {
        ...item._doc,
        expiryDate: date,
      };
    })
    .filter((item) => new Date(item.expiryDate) < new Date());

  return res.status(200).json(newPurchase);
});

const changePaymentStatus = expressAsyncHandler(async (req, res) => {

  const {id} = req.body;

  const purchase = await Purchase.findOneAndUpdate({_id: id}, {paid: true});

  if(!purchase) {
    return res.status(404).json({msg : "not found"})
  }

  return res.status(200).json(purchase)

})


module.exports = {
  addPurchase,
  getPurchase,
  getPurchaseWithExpiry,
  unShelfItem,
  updatePaidStatusPurchase,
  updateShelfStatus,
  getExpiredInventoryItems,
  getVendorWisePurchase,
  changePaymentStatus
};
