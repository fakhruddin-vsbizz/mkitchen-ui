const express = require("express");
const {
  addFoodItem,
  getFoodItem,
} = require("../controllers/foodItemController");

const router = express.Router();

router.post("/", addFoodItem);
router.get("/", getFoodItem);

module.exports = router;
