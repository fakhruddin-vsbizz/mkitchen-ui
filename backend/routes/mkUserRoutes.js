const express = require("express");

const { createMkUser, getMkUser } = require("../controllers/mkUserController");
const router = express.Router();

router.post("/", createMkUser);
router.get("/", getMkUser);

module.exports = router;
