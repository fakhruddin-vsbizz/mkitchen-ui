const express = require("express");
const {
  addPurchase,
  getPurchase,
  getPurchaseWithExpiry,
  unShelfItem,
  updatePaidStatusPurchase,
  updateShelfStatus,
  getExpiredInventoryItems,
  getVendorWisePurchase,
  changePaymentStatus,
  getOnePurchase,
} = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", addPurchase);
router.post("/payment_done", changePaymentStatus);
router.post("/expired_items", getExpiredInventoryItems);

router.put("/", updatePaidStatusPurchase);
router.put("/update_shelf", updateShelfStatus);

router.get("/vendor_purchase", getVendorWisePurchase);

router.get("/", getPurchase);
router.get("/getOne/:id", getOnePurchase);

router.get("/withExpiry", getPurchaseWithExpiry);
router.delete("/:id", unShelfItem);

module.exports = router;
