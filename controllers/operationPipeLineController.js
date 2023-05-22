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
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    const menuList = await FoodMenu.findOne({ _id: menu_id });

    const dispatch = pipeline.dispatch;

    const menu = menuList.food_list.map((item) => ({
      foodName: item.food_name,
    }));

    const newPipeLine = pipeline.ingridient_list.map((item, indx) => ({
      ...item,
      ...menu[indx],
      ...dispatch[indx],
    }));

    if (pipeline) {
      return res.status(201).json(newPipeLine);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }
  //get status of OP

  if (type === "get_status_op") {
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    if (pipeline) {
      return res.status(201).json(pipeline.status);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }

  if (type === "get_reorder_data") {
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    if (pipeline) {
      return res.status(201).json(pipeline);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }

  if (type === "get_dispatch_data") {
    const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });
    if (pipeline) {
      return res.status(201).json(pipeline);
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

      try {
        dispatchArr.forEach((ele, index1) => {
          if (ele.mk_id === mk_id) {
            dispatchArr[index1].dispatch.forEach((element, index2) => {
              if (element.food_item_id === food_item_id) {
                dispatchArr[index1].dispatch[index2].delivery_status =
                  "completed";
              }
            });
          }
        });

        console.log("dispatch array: ", dispatchArr);
        console.log("dispatch1: ", dispatchArr[0].dispatch);
        console.log("dispatch2: ", dispatchArr[1]?.dispatch);

        const updated = await pipeline.updateOne({
          $set: { dispatch: dispatchArr },
        });

        return res.status(201).json(dispatchArr);
      } catch (error) {
        throw new Error(
          "Some issue occured while doing the try",
          error.message
        );
      }
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
      return res.status(201).json(targetDispatchObj.dispatch);
    } else {
      res.status(400);
      throw new Error("Error getting the pipeline");
    }
  }

  if (type === "post_dispatch_data") {
    if (total_weight === undefined || no_of_deigh === undefined) {
      return res
        .status(403)
        .json({ invalidData: "total weight and daigh cannot be empty" });
    }

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
      // create a new `dispatch` object and set its fields
      const newObj = [
        {
          mk_id: mk_id,
          dispatch: [newDispatchObj],
        },
      ];
      // add the new object to the collection
      const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
        { _id: Object(operationId._id) },
        { $set: { dispatch: newObj } },
        { new: true }
      );
      if (updatePipeline) {
        return res.json({ message: "pipeline  updated successfully" });
      }
    } else {
      // find the existing `dispatch` object with the matching `mk_id`, if any

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

    return res.json({ message: "operationPipeLine  added" });
  }
});

const getOperationPipeline = expressAsyncHandler(async (req, res) => {
  const operationPipeLine = await OperationPipeLine.find();
  return res.json(operationPipeLine);
});

const updateOperationPipeline = expressAsyncHandler(async (req, res) => {
  const { type, menu_id, dispatch, status, inventory_id } = req.body;

  const operationId = await OperationPipeLine.findOne({
    menu_food_id: menu_id,
  });

  if (type === "update_operation_pipeline_dispatch_logs") {
    const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
      { _id: Object(operationId._id) },
      { $set: { dispatch: dispatch } },
      { new: true }
    );
    if (updatePipeline) {
      return res.json({ message: "pipeline  updated successfully" });
    }
  }

  if (type === "update_operation_pipeline_status") {
    const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
      { _id: Object(operationId._id) },
      { $set: { status: status } },
      { new: true }
    );
    if (updatePipeline) {
      return res.json({ message: "pipeline  updated successfully" });
    }
  }

  if (type === "update_operation_pipeline_reorder_status") {
    const reorderArr = operationId.reorder_logs;
    reorderArr.forEach((item, index) => {
      if (item.inventory_id === inventory_id) {
        reorderArr[index].reorder_delivery_status = false;
      }
    });
    await operationId.updateOne({ reorder_logs: reorderArr });
    return res.json({ message: "reOrderLog  updated successfully" });
  }
});

module.exports = {
  addOperationPipeline,
  getOperationPipeline,
  updateOperationPipeline,
};
