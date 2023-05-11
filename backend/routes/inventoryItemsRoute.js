const express = require("express");
const {
	addInventoryItems,
	getInventoryItems,
	updateInventoryItems,
	decommissionOne,
	recommissionOne,
} = require("../controllers/inventoryItemsController");

const router = express.Router();

router.post("/", addInventoryItems);
router.get("/", getInventoryItems);
router.put("/", updateInventoryItems);
router.put("/decommission/:id", decommissionOne);
router.put("/recommission/:id", recommissionOne);

module.exports = router;
