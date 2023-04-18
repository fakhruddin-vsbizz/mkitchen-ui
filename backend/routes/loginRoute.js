const express = require("express");
const { loginUser } = require("../controllers/mkUserController");

const router = express.Router();

router.post("/", loginUser);

module.exports = router;
