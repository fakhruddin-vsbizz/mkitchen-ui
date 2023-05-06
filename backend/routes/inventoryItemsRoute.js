const express = require("express");
const {
  addInventoryItems,
  getInventoryItems,
  updateInventoryItems,
} = require("../controllers/inventoryItemsController");

const router = express.Router();

router.post("/", addInventoryItems);
router.get("/", getInventoryItems);
router.put("/", updateInventoryItems);

module.exports = router;
