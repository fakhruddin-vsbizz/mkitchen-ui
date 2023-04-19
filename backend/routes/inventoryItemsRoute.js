const express = require("express");
const {
  addInventoryItems,
  getInventoryItems,
} = require("../controllers/inventoryItemsController");

const router = express.Router();

router.post("/", addInventoryItems);
router.get("/", getInventoryItems);

module.exports = router;
