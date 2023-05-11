const express = require("express");
const {
	addPurchase,
	getPurchase,
	getPurchaseWithExpiry,
	unShelfItem,
} = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", addPurchase);
router.get("/", getPurchase);
router.get("/withExpiry", getPurchaseWithExpiry);
router.delete("/:id", unShelfItem);

module.exports = router;
