const express = require("express");

const {
  addDeliveryReview,
  getDeliveryReview,
  getReviewsForMKUser,
} = require("../controllers/menuDeliveryReviewController");

const {
  getMohallaReviews,
} = require("../controllers/ReviewControllers/mohallaReviewController");

const router = express.Router();

router.post("/", addDeliveryReview);
router.post("/mkuser", getReviewsForMKUser);

router.post("/get_mohalla_review", getMohallaReviews);


router.get("/", getDeliveryReview);

module.exports = router;
