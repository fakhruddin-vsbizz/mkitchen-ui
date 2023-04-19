const express = require("express");
const {
  addPurchase,
  getPurchase,
} = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", addPurchase);
router.get("/", getPurchase);

module.exports = router;
