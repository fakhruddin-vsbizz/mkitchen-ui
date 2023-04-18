const express = require("express");

const {
  addDeliveryReview,
  getDeliveryReview,
} = require("../controllers/menuDeliveryReviewController");

const router = express.Router();

router.post("/", addDeliveryReview);
router.get("/", getDeliveryReview);

module.exports = router;
