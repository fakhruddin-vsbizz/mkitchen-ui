const express = require("express");
const {
  addInventoryItems,
  getInventoryItems,
  updateInventoryItems,
  decommissionOne,
  recommissionOne,
  updateInventoryVolume,
  updateInventoryAllItems,
  getNegativeInventory,
} = require("../controllers/inventoryItemsController");

const router = express.Router();

router.post("/", addInventoryItems);
router.get("/", getInventoryItems);
router.get("/negative_inventory", getNegativeInventory);

router.put("/", updateInventoryItems);
router.put("/update_volume", updateInventoryVolume);
router.put("/update_inventory", updateInventoryAllItems);

router.put("/decommission/:id", decommissionOne);
router.put("/recommission/:id", recommissionOne);

module.exports = router;
