const expressAsyncHandler = require("express-async-handler");
const FoodMenu = require("../models/menuFoodModel");
const OperationPipeLine = require("../models/operationPipeLineModel");

const addOperationPipeline = expressAsyncHandler(async (req, res) => {
  const { date, ingridient_list, status } = req.body;

  //getting the id's for the respective user
  const menuFood = await FoodMenu.findOne({
    date_of_cooking: date,
  });

  if (menuFood) {
    const operationPipeLine = await OperationPipeLine.create({
      menu_food_id: menuFood._id,
      ingridient_list,
      status,
    });

    if (operationPipeLine) {
      res.status(201).json({
        _id: operationPipeLine.id,
        review: operationPipeLine.menu_food_id,
      });
    } else {
      res.status(400);
      throw new Error("Error creating the operationPipeLine ");
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
