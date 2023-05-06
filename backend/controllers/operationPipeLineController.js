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
    delivery_status,
    food_name,
  } = req.body;

  const operationId = await OperationPipeLine.findOne({
    menu_food_id: menu_id,
  });

  if (type === "get_ingridient_list") {
    console.log("in here");
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    if (pipeline) {
      res.status(201).json(pipeline.ingridient_list);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }
  //get status of OP

  if (type === "get_status_op") {
    console.log("in here");
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    if (pipeline) {
      res.status(201).json(pipeline.status);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }

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

  if (type === "update_dispatch_delivery_status") {
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    const dispatchArr = pipeline.dispatch;

    if (dispatchArr) {
      // let targetDispatchObj = dispatchArr.find(
      //   (dispatch) => dispatch.mk_id === mk_id
      // );

      dispatchArr.forEach((ele, index1) => {
        if (ele.mk_id === mk_id) {
          dispatchArr[index1].dispatch.forEach((element, index2) => {
            if (element.food_item_id === food_item_id) {
              console.log("yes");
              dispatchArr[index1].dispatch[index2].delivery_status =
                "completed";
            }
          });
        }
      });

      console.log("dispatch array: ", dispatchArr);

      await pipeline.updateOne({ $set: { dispatch: dispatchArr } });

      res.status(201).json(dispatchArr);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }

  if (type === "get_mohalla_dispatch_data") {
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    const dispatchArr = pipeline.dispatch;

    if (dispatchArr) {
      const targetDispatchObj = dispatchArr.find(
        (dispatch) => dispatch.mk_id === mk_id
      );
      res.status(201).json(targetDispatchObj.dispatch);
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
      delivery_status: delivery_status,
      food_name: food_name,
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
  const { type, menu_id, dispatch, status, inventory_id } = req.body;

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

  if (type === "update_operation_pipeline_status") {
    console.log("inside status updation");
    const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
      { _id: Object(operationId._id) },
      { $set: { status: status } },
      { new: true }
    );
    if (updatePipeline) {
      console.log("success");
      res.json({ message: "pipeline  updated successfully" });
    }
  }

  if (type === "update_operation_pipeline_reorder_status") {
    console.log("id: ", inventory_id);
    const reorderArr = operationId.reorder_logs;
    reorderArr.forEach((item, index) => {
      if (item.inventory_id === inventory_id) {
        reorderArr[index].reorder_delivery_status = false;
      }
    });
    await operationId.updateOne({ reorder_logs: reorderArr });
    res.json({ message: "reOrderLog  updated successfully" });
  }
});

module.exports = {
  addOperationPipeline,
  getOperationPipeline,
  updateOperationPipeline,
};
