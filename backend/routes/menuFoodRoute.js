const express = require("express");

const {
	addFoodMenu,
	getFoodMenu,
	updateFoodMenuAskahs,
	getMenuBasedOnDate,
	getFoodItem,
	getItemId,
	createFoodItem,
	addMenu,
} = require("../controllers/menuFoodController");
const router = express.Router();

router.post("/", addFoodMenu);
router.get("/", getFoodMenu);
router.get("/get_food_item", getFoodItem);
router.post("/get_food_item_id", getItemId);
router.post("/food_item", createFoodItem);
router.post("/add_menu", addMenu);
router.get("/todays-menu", getMenuBasedOnDate);

router.put("/", updateFoodMenuAskahs);

module.exports = router;
