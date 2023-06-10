const expressAsyncHandler = require("express-async-handler");
const FoodMenu = require("../models/menuFoodModel");
const OperationPipeLine = require("../models/operationPipeLineModel");

const addLeftOverData = expressAsyncHandler(async (req, res) => {
  const {
    menu_id,
    foodId,
    foodName,
    inventory_id,
    ingredient_name,
    leftover_amount,
  } = req.body;

  try {

    const operationId = await OperationPipeLine.findOne({
      menu_food_id: menu_id,
    });
  
    if (leftover_amount === undefined) {
      return res
        .status(403)
        .json({ invalidData: "total weight and daigh cannot be empty" });
    }
  
    // const leftoverDoc = await OperationPipeLine.findOne({
    //   menu_food_id: menu_id,
    // });
  
    const leftOverArr = operationId.leftover;
  
    const ingredientLs = operationId.ingridient_list;
  
    const newLeftOverObj = {
      foodId,
      foodName,
      inventory_id: inventory_id,
      ingredient_name: ingredient_name,
      leftover_amount: +leftover_amount,
    };
  
    // if (leftOverArr.length === 0) {
    //   // add the new object to the collection
    //   const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
    //     { _id: Object(operationId._id) },
    //     { $set: { leftover: [newLeftOverObj] } },
    //     { new: true }
    //   );
  
    //   if (updatePipeline) {
    //     return res.json({ message: "pipeline  updated successfully" });
    //   }
    // } else {
      leftOverArr.push(newLeftOverObj);
      // }
  
      ingredientLs.forEach((item)=> {
        if (item.inventory_item_id === inventory_id && item.foodId === foodId) {
          item.procure_amount = Number((item.procure_amount - Number(leftover_amount.toFixed(2))).toFixed(2));
          item.leftover = newLeftOverObj;
        }
      })
  
    // update the document in MongoDB with the modified `dispatch` array
    await operationId.updateOne({  leftover: leftOverArr, ingridient_list: ingredientLs });
  
    return res.json(operationId);    
  } catch (err) {
    console.log(err);
  }

});

const getReorderLeftOverData = expressAsyncHandler(async (req, res) => {
  const { menu_id } = req.body;

  try {
    const result = await OperationPipeLine.aggregate([
      {
        $lookup: {
          from: "menufoods",
          localField: "menu_food_id",
          foreignField: "_id",
          as: "menu_food_data",
        },
      },
      {
        $project: {
          date_of_cooking: {
            $arrayElemAt: ["$menu_food_data.date_of_cooking", 0],
          },
          reorder_logs: 1,
          leftover: 1,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = {
  addLeftOverData,
  getReorderLeftOverData,
};
