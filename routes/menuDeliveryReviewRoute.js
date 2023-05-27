const express = require("express");

const {
  addDeliveryReview,
  getDeliveryReview,
  getReviewsForMKUser,
} = require("../controllers/menuDeliveryReviewController");

const {
  getMohallaReviews,
  getMenuReviewReportForAdmin,
} = require("../controllers/ReviewControllers/mohallaReviewController");

const router = express.Router();

router.post("/", addDeliveryReview);
router.post("/mkuser", getReviewsForMKUser);

router.post("/get_mohalla_review", getMohallaReviews);
router.post("/admin_history", getMenuReviewReportForAdmin);

router.get("/", getDeliveryReview);

module.exports = router;
