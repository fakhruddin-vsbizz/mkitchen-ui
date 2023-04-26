const expressAsyncHandler = require("express-async-handler");
const FoodMenu = require("../models/menuFoodModel");
const OperationPipeLine = require("../models/operationPipeLineModel");

const addOperationPipeline = expressAsyncHandler(async (req, res) => {
  const { date, ingridient_list, status, type, menu_id } = req.body;

  if (type === "get_reorder_data") {
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    if (pipeline) {
      res.status(201).json(pipeline);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }

  res.json({ message: "operationPipeLine  added" });
});

const getOperationPipeline = expressAsyncHandler(async (req, res) => {
  const operationPipeLine = await OperationPipeLine.find();
  res.json(operationPipeLine);
});

const updateOperationPipeline = expressAsyncHandler(async (req, res) => {
  const { updateData, id } = req.body;

  const data = await OperationPipeLine.findOne({ _id: id });

  if (!data) {
    return res.status(404).json({ error: "Document not found" });
  }

  if (updateData.ingridient_list) {
    data.ingridient_list = updateData.ingridient_list;
  }

  if (updateData.status) {
    data.status = updateData.status;
  }

  const updatedDocument = await data.save();

  return res.json(updatedDocument);
});

module.exports = {
  addOperationPipeline,
  getOperationPipeline,
  updateOperationPipeline,
};
