const express = require("express");
const {
  addLeftOverData,
  getReorderLeftOverData,
} = require("../controllers/cookingController");

const router = express.Router();

router.post("/add_leftover", addLeftOverData);
router.get("/reorder_leftover", getReorderLeftOverData);

module.exports = router;
