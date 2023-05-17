const express = require("express");
const {
  addPurchase,
  getPurchase,
  getPurchaseWithExpiry,
  unShelfItem,
  updatePaidStatusPurchase,
  updateShelfStatus,
} = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", addPurchase);
router.put("/", updatePaidStatusPurchase);
router.put("/update_shelf", updateShelfStatus);

router.get("/", getPurchase);
router.get("/withExpiry", getPurchaseWithExpiry);
router.delete("/:id", unShelfItem);

module.exports = router;
