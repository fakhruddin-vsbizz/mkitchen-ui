const expressAsyncHandler = require("express-async-handler");
const FoodMenu = require("../models/menuFoodModel");
const OperationPipeLine = require("../models/operationPipeLineModel");

const addOperationPipeline = expressAsyncHandler(async (req, res) => {
  const {
    date,
    ingridient_list,
    status,
    type,
    menu_id,

    //add dispatch data
    food_item_id,
    total_weight,
    no_of_deigh,
    mk_id,
  } = req.body;

  const operationId = await OperationPipeLine.findOne({
    menu_food_id: menu_id,
  });

  if (type === "get_reorder_data") {
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    if (pipeline) {
      res.status(201).json(pipeline);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }

  if (type === "get_dispatch_data") {
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    if (pipeline) {
      res.status(201).json(pipeline);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }

  if (type === "post_dispatch_data") {
    const dispatchDoc = await OperationPipeLine.findOne({
      menu_food_id: menu_id,
    });
    const dispatchArr = dispatchDoc.dispatch;

    const newDispatchObj = {
      food_item_id: food_item_id,
      total_weight: total_weight,
      no_of_deigh: no_of_deigh,
    };

    if (dispatchArr.length === 0) {
      console.log("in if");

      // create a new `dispatch` object and set its fields
      const newObj = [
        {
          mk_id: mk_id,
          dispatch: [newDispatchObj],
        },
      ];
      console.log("newObj:", newObj);
      // add the new object to the collection
      const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
        { _id: Object(operationId._id) },
        { $set: { dispatch: newObj } },
        { new: true }
      );
      if (updatePipeline) {
        console.log("success");
        res.json({ message: "pipeline  updated successfully" });
      }
    } else {
      console.log("in else");
      // find the existing `dispatch` object with the matching `mk_id`, if any

      console.log(dispatchArr);
      console.log(mk_id);

      const targetDispatchObj = dispatchArr.find(
        (dispatch) => dispatch.mk_id === mk_id
      );

      if (targetDispatchObj) {
        // if a matching `dispatch` object is found, add the new `dispatch` object to its `dispatch` array
        targetDispatchObj.dispatch.push(newDispatchObj);
      } else {
        // if no matching `dispatch` object is found, create a new one and add it to the `dispatch` array
        const newDispatchObjWithId = {
          mk_id: mk_id,
          dispatch: [newDispatchObj],
        };

        dispatchArr.push(newDispatchObjWithId);
      }

      // update the document in MongoDB with the modified `dispatch` array
      await dispatchDoc.updateOne({ $set: { dispatch: dispatchArr } });
    }

    res.json({ message: "operationPipeLine  added" });
  }
});

const getOperationPipeline = expressAsyncHandler(async (req, res) => {
  const operationPipeLine = await OperationPipeLine.find();
  res.json(operationPipeLine);
});

const updateOperationPipeline = expressAsyncHandler(async (req, res) => {
  const { type, menu_id, dispatch } = req.body;

  const operationId = await OperationPipeLine.findOne({
    menu_food_id: menu_id,
  });

  console.log(operationId);
  console.log(dispatch);
  if (type === "update_operation_pipeline_dispatch_logs") {
    console.log("inside");
    const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
      { _id: Object(operationId._id) },
      { $set: { dispatch: dispatch } },
      { new: true }
    );
    if (updatePipeline) {
      console.log("success");
      res.json({ message: "pipeline  updated successfully" });
    }
  }
});

module.exports = {
  addOperationPipeline,
  getOperationPipeline,
  updateOperationPipeline,
};
