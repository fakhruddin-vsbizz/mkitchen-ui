const express = require("express");
const {
  passWordResetLink,
} = require("../controllers/emailNotificationController");

const router = express.Router();

router.post("/", passWordResetLink);

module.exports = router;
