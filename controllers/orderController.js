const Order = require("../models/ordersModal");
const expressAsyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const addOrder = expressAsyncHandler(async (req, res) => {
  const {
    //doc
    documents,
  } = req.body;

  try {
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
        return res
          .status(403)
          .json({ fieldError: "please add all the fields" });
      }
    });
    // Create an array of write operations to perform in bulk
    const ops = documents.map((doc) => ({
      insertOne: { document: doc },
    }));

    // Perform the bulk write operation
    await Order.bulkWrite(ops)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });

    return res.json({ message: "Order added" });
  } catch (error) {
    console.log(error);
  }
});

const getOrders = expressAsyncHandler(async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $sort: { deliveryStatus: -1 },
      },
      {
        $lookup: {
          from: "vendormodels",
          localField: "vendor_id",
          foreignField: "_id",
          as: "vendorInfo",
        },
      },
      {
        $lookup: {
          from: "inventoryitems",
          localField: "inventory_id",
          foreignField: "_id",
          as: "inventoryInfo",
        },
      },
      //to create the seperate document
      {
        $unwind: "$vendorInfo",
      },
      {
        $unwind: "$inventoryInfo",
      },
      {
        $project: {
          _id: 1,
          vendor_id: 1,
          mkuser_id: 1,
          ingredient_name: 1,
          quantity_loaded: 1,
          deliveryStatus: 1,
          rate_per_unit: 1,
          unit: "$inventoryInfo.ingridient_measure_unit",
          vendorName: "$vendorInfo.vendor_name",
        },
      },
    ]);

    // const totalAmountSum = data.reduce((sum, item) => sum + item.total_amount, 0);
    const arrayLength = data.length;

    return res.status(200).json({ data, totalOrders: arrayLength });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
  // const purchase = await Purchase.find();
});
const getOneOrder = expressAsyncHandler(async (req, res) => {
  // const purchase = await Purchase.find();

  try {
    const { id } = req.params;

    const data = await Order.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "vendormodels",
          localField: "vendor_id",
          foreignField: "_id",
          as: "vendorInfo",
        },
      },
      {
        $lookup: {
          from: "inventoryitems",
          localField: "inventory_id",
          foreignField: "_id",
          as: "inventoryInfo",
        },
      },
      //to create the seperate document
      {
        $unwind: "$vendorInfo",
      },
      {
        $unwind: "$inventoryInfo",
      },
      {
        $project: {
          _id: 1,
          vendor_id: 1,
          mkuser_id: 1,
          ingredient_name: 1,
          quantity_loaded: 1,
          rate_per_unit: 1,
          inventory_id: 1,
          unit: "$inventoryInfo.ingridient_measure_unit",
          vendorName: "$vendorInfo.vendor_name",
        },
      },
    ]);

    if (!data) {
      return res.status(404).json({ msg: "data does not exist" });
    }

    console.log(data);

    // const totalAmountSum = data.reduce((sum, item) => sum + item.total_amount, 0);
    const arrayLength = data.length;

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
});

module.exports = {
  addOrder,
  getOrders,
  getOneOrder,
};
