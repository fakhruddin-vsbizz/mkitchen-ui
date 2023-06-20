const expressAsyncHandler = require("express-async-handler");
const FoodMenu = require("../models/menuFoodModel");
const OperationPipeLine = require("../models/operationPipeLineModel");
const FinalizeProcureModel = require( "../models/finalizeProcureModel" );
const InventoryItemsModel = require( "../models/inventoryItemsModel" );
const { ObjectId } = require("mongodb");

const addTotalPriceToFood = expressAsyncHandler(async (req, res) => {

  const {menu_id} = req.body;

  
  let newList = [];

  if (!menu_id) {
    return res.status(401).json(newList)
  }

  try {
    const menu = await FoodMenu.findOne({_id: menu_id}, 'food_list')
    
    if (!menu) {
      return res.status(404).json(newList);
    }
    
    const ingredientList = await OperationPipeLine.findOne({ menu_food_id : menu_id}, 'ingridient_list.foodId ingridient_list.inventory_item_id ingridient_list.procure_amount');

    if (!ingredientList) {
      return res.status(404).json(newList);
    }
    

    const inventoryIdList = ingredientList.ingridient_list.map(item => item.inventory_item_id)

    const inventoryPrices = await InventoryItemsModel.find({ _id: { $in: inventoryIdList} }, 'price');

    const priceList = ingredientList.ingridient_list.map(ingredient => {
      const temp = inventoryPrices.find(inventory => inventory._id.toString() === ingredient.inventory_item_id);
      
      return {
        foodId: ingredient.foodId,
        price: Number((ingredient.procure_amount * temp.price).toFixed(2))
      }
    })

    newList = menu.food_list.map(food => {
      const temp = priceList.filter(filterItem => filterItem.foodId === food.food_item_id).reduce((a,b) =>  Number((a + b.price).toFixed(2)), 0);
      return {
        foodId: food.food_item_id,
        price: temp
      }
    })

    return res.status(200).json(newList)

  } catch (error) {
    console.log(error);
  }

})



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
  
  
  if (type === "get_full_pipeline") {
    
    const operationPipe = await OperationPipeLine.aggregate([
      {
        $match : {menu_food_id: new ObjectId(menu_id)},
      },
      {       
        $lookup: {
          from: "menufoods",
          localField: "menu_food_id",
          foreignField: "_id",
          as: "menu_food_data",
        },
      },
    ]);

    
    
    if(!operationPipe[0]){
      return res.status(404).json({msg: "Pipeline doesn't exist"})
    }

    return res.status(200).json(operationPipe[0])
  }

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
      return res
        .status(201)
        .json({ data: newPipeLine, leftover: pipeline.leftover });
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

    if (!pipeline) return res.status(404).json({msg: "no pipeline"})
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

    const {unitValueType, containerType} = req.body;

    try {
      if (total_weight === undefined || no_of_deigh === undefined) {
        return res
          .status(403)
          .json({ invalidData: "total weight and daigh cannot be empty" });
      }
  
      const dispatchDoc = await OperationPipeLine.findOne({
        menu_food_id: menu_id,
      });
      const dispatchArr = await dispatchDoc.dispatch;
  
      const newDispatchObj = {
        food_item_id: food_item_id,
        total_weight: total_weight,
        unitValueType,
        containerType,
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
          // return res.json({ message: "pipeline  updated successfully" });
          return res.status(200).json({message: "pipeline  updated successfully", data: updatePipeline.dispatch});
        }
      } else {
        // find the existing `dispatch` object with the matching `mk_id`, if any
  
        const targetDispatchObj = await dispatchArr.find(
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
        await dispatchDoc.updateOne({ dispatch: dispatchArr });
        return res.status(200).json({ message: "operationPipeLine  added", data: dispatchDoc?.dispatch});
      }
  
      return res.json({ message: "operationPipeLine  added" });
    } catch (error) {
      console.log(error);
    }
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
    const ingredientLs = operationId.ingridient_list;
    
    reorderArr.forEach((item) => {
      if (item.inventory_id === inventory_id && item.foodId === req.body?.foodId) {
        item.reorder_delivery_status = false;
      }
    });

    ingredientLs.forEach((item)=> {
      if (item.inventory_item_id === inventory_id && item.foodId === req.body?.foodId) {
        item.procure_amount = Number((item.procure_amount + req.body?.procured_Amount).toFixed(3));
      }
    })

    await operationId.updateOne({ reorder_logs: reorderArr, ingridient_list: ingredientLs });

    await InventoryItemsModel.findOneAndUpdate({_id: req.body.inventory_id},{
      $inc: {
        total_volume: -req.body.procured_Amount
      }
    })

    
    // const procuredItem = await FinalizeProcureModel.findOne({menu_id: req.body.menu_id}).lean()

    // console.log("procuredItem",procuredItem);
  
    //   const newProcuredItems = await procuredItem?.procure_items.map(item => item?.inventoryItemId === req.body.inventory_id? ({
    //       ...item,
    //       requiredVolume: item.requiredVolume + req.body.procured_Amount,
    //       total_quantity: item.total_quantity -req.body.procured_Amount
    //     }): item
    //   )
  
    // console.log("newProcuredItems",newProcuredItems);
    
    // const something = await FinalizeProcureModel.findOneAndUpdate({menu_id: req.body.menu_id}, {procure_items: newProcuredItems});

    return res.status(200).json({ message: "reOrderLog  updated successfully" });
  }
});

const changeInventoryAmount = expressAsyncHandler(async (req, res) => {
  const newInventoryItem = await InventoryItemsModel.findOneAndUpdate({_id: req.body.inventory_id},{
    $inc: {
      total_volume: -req.body.procured_Amount
    }
  })
  return res.status(200).json(newInventoryItem);
});

const changeProcurementAmount = expressAsyncHandler(async (req, res) => {
  const procuredItem = await FinalizeProcureModel.findOne({menu_id: req.body.menu_id}).lean()

    const newProcuredItems = await procuredItem?.procure_items.map(item => item?.inventoryItemId === req.body.inventory_id? ({
        ...item,
        requiredVolume: item.requiredVolume + req.body.procured_Amount,
        total_quantity: item.total_quantity -req.body.procured_Amount
      }): item
    )
  
  const something = await FinalizeProcureModel.findOneAndUpdate({menu_id: req.body.menu_id}, {procure_items: newProcuredItems});
   
  return res.status(200).json(something);
});

const getIngredients = expressAsyncHandler(async (req, res) => {
  const {menu_food_id} = req.body;

  const ingredients = await OperationPipeLine.findOne({menu_food_id}, 'ingridient_list').exec()

  if (!ingredients) return res.status(404).json({msg: "no ingredient for today"})

  return res.status(200).json(ingredients)

})

module.exports = {
  addOperationPipeline,
  getOperationPipeline,
  updateOperationPipeline,
  changeInventoryAmount,
  changeProcurementAmount,
  getIngredients,
  addTotalPriceToFood
};
