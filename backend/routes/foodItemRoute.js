const express = require("express");
const {
  getFoodItemList,
  getFoodItem,
  updateIngridientList,
} = require("../controllers/foodItemController");

const router = express.Router();

router.post("/", getFoodItemList);
router.get("/", getFoodItem);
router.put("/", updateIngridientList);

module.exports = router;
