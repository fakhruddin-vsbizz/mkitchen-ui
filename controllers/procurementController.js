const expressAsyncHandler = require("express-async-handler");
const MenuFood = require("../models/menuFoodModel");
const OperationPipeLine = require("../models/operationPipeLineModel");
const Inventory = require("../models/inventoryItemsModel");
const FinalizeProcure = require("../models/finalizeProcureModel");
// const { ObjectId } = require("mongodb");


const procumentoryOperation = expressAsyncHandler(async (req, res) => {
  const { menu_id, type, documents, procure_items, date } = req.body;

  const pipeline = await OperationPipeLine.findOne({ menu_food_id: menu_id });

  if (type === "get_procure_data") {
    // Get total ashkash count from food_menu collection
    const foodMenu = await MenuFood.findOne({ _id: menu_id });
    const totalAshkashCount = foodMenu.mohalla_wise_ashkhaas.reduce(
      (acc, curr) => acc + curr.total_ashkhaas,
      0
    );

    const inventoryItems = await OperationPipeLine.find({
      menu_food_id: menu_id,
    }).lean();

    //adding the perAshkash of similar ingridiets in if condition else not adding and returning the remaining object
    const ingridientGroups = {};
    inventoryItems[0].ingridient_list.forEach((item) => {
      if (ingridientGroups[item.inventory_item_id]) {
        ingridientGroups[item.inventory_item_id].perAshkash += item.perAshkash;
      } else {
        ingridientGroups[item.inventory_item_id] = {
          ingridientName: item.ingredient_name,
          perAshkash: item.perAshkash,
          unit: null,
          requiredVolume: 0,
          sufficient: false,
        };
      }
    });

    //preparing final array based on the calculation
    const results = await Promise.all(
      Object.entries(ingridientGroups).map(async ([inventoryItemId, group]) => {
        const requiredVolume = group.perAshkash * totalAshkashCount;
        const inventory = await Inventory.findById(inventoryItemId).lean();
        return {
          inventoryItemId,
          ingridientName: group.ingridientName,
          total_quantity: Number((inventory.total_volume - requiredVolume).toFixed(2)),
          unit: group.unit ?? inventory.ingridient_measure_unit,
          requiredVolume: Number(requiredVolume.toFixed(2)),
          sufficient: inventory.total_volume >= requiredVolume,
        };
      })
    );

    res.json(results);
  }

  if (type === "procure_ingridient") {
    // Create an array of write operations to perform in bulk
    const updateInventory = documents.map((inventory) => ({
      updateOne: {
        filter: { _id: inventory.inventoryItemId },
        update: {
          $set: {
            total_volume: Number(inventory.total_quantity),
          },
        },
      },
    }));

    const procurementExists = await FinalizeProcure.findOne({menu_id});

    // return res.json(updateInventory);
    
    // Perform the bulk write operation
    await Inventory.bulkWrite(updateInventory)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });

    const updatePipeline = await OperationPipeLine.findByIdAndUpdate(
      { _id: Object(pipeline._id) },
      { $set: { status: 2 } },
      { new: true }
    );

    if (!procurementExists) {
  
      const procureData = await FinalizeProcure.create({
        procure_items,
        date,
        menu_id
      });

    
      
    } else if (procurementExists) {
      
      const procureData = await FinalizeProcure.findOneAndUpdate({menu_id},{
        procure_items
      });

      
    }
    if (updatePipeline) {
      return res.status(201).json({ message: "pipeline  updated successfully" });
    }

  }

  if (type === "get_procure_history") {
    try {
      
      const procure = await FinalizeProcure.findOne({ menu_id: menu_id });
  
      if (procure) {
        res.status(200).json(procure);
      } else {
        res.status(200).json({ message: "no procure data" });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

module.exports = { procumentoryOperation };
