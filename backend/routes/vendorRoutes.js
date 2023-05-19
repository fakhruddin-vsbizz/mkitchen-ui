const express = require("express");

const {
  addVendor,
  getVendor,
  updateVendor,
  getVendorPurchaseWithOrderHistory,
  getTotalVendorPurchase,
} = require("../controllers/vendorController");
const router = express.Router();

router.post("/", addVendor);
router.get("/", getVendor);
router.get("/vendor_purchase_record", getVendorPurchaseWithOrderHistory);
router.get("/totalpurchase", getTotalVendorPurchase);

router.put("/", updateVendor);

module.exports = router;
