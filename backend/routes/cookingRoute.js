const express = require("express");
const { addLeftOverData } = require("../controllers/cookingController");

const router = express.Router();

router.post("/add_leftover", addLeftOverData);

module.exports = router;
