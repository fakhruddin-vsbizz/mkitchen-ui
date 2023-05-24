const expressAsyncHandler = require("express-async-handler");
const FoodMenu = require("../models/menuFoodModel");
const OperationPipeLine = require("../models/operationPipeLineModel");

const addLeftOverData = expressAsyncHandler(async (req, res) => {
  const {
    menu_id,

    //add dispatch data
    inventory_id,
    ingredient_name,
    leftover_amount,
  } = req.body;

  const operationId = await OperationPipeLine.findOne({
    menu_food_id: menu_id,
  });

  if (leftover_amount === undefined) {
    return res
      .status(403)
      .json({ invalidData: "total weight and daigh cannot be empty" });
  }

  const leftoverDoc = await OperationPipeLine.findOne({
    menu_food_id: menu_id,
  });

  const leftOverArr = leftoverDoc.leftover;

  const newLeftOverObj = {
    inventory_id: inventory_id,
    ingredient_name: ingredient_name,
    leftover_amount: +leftover_amount,
  };

  if (leftOverArr.length === 0) {
    // add the new object to the collection
    const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
      { _id: Object(operationId._id) },
      { $set: { leftover: [newLeftOverObj] } },
      { new: true }
    );
    if (updatePipeline) {
      return res.json({ message: "pipeline  updated successfully" });
    }
  } else {
    leftOverArr.push(newLeftOverObj);
  }

  // update the document in MongoDB with the modified `dispatch` array
  await leftoverDoc.updateOne({ $set: { leftover: leftOverArr } });

  return res.json({ message: "operationPipeLine  added" });
});

module.exports = {
  addLeftOverData,
};
