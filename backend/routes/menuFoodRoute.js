const express = require("express");

const {
  addFoodMenu,
  getFoodMenu,
  updateFoodMenuAskahs,
  getMenuBasedOnDate,
} = require("../controllers/menuFoodController");
const router = express.Router();

router.post("/", addFoodMenu);
router.get("/", getFoodMenu);
router.get("/todays-menu", getMenuBasedOnDate);

router.put("/", updateFoodMenuAskahs);

module.exports = router;
