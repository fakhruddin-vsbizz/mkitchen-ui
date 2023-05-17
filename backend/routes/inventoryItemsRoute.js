const express = require("express");
const {
  addInventoryItems,
  getInventoryItems,
  updateInventoryItems,
  decommissionOne,
  recommissionOne,
  updateInventoryVolume,
} = require("../controllers/inventoryItemsController");

const router = express.Router();

router.post("/", addInventoryItems);
router.get("/", getInventoryItems);
router.put("/", updateInventoryItems);
router.put("/update_volume", updateInventoryVolume);

router.put("/decommission/:id", decommissionOne);
router.put("/recommission/:id", recommissionOne);

module.exports = router;
