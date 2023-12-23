const express = require("express");
const {
  addOrder,
  getOrders,
  getOneOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", addOrder);
router.get("/getOne/:id", getOneOrder);
router.get("/", getOrders);
// router.post("/payment_done", changePaymentStatus);
// router.post("/expired_items", getExpiredInventoryItems);

// router.put("/", updatePaidStatusPurchase);
// router.put("/update_shelf", updateShelfStatus);

// router.get("/vendor_purchase", getVendorWisePurchase);

// router.get("/", getPurchase);

// router.get("/withExpiry", getPurchaseWithExpiry);
// router.delete("/:id", unShelfItem);

module.exports = router;
