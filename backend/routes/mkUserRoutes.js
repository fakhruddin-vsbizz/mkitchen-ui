const express = require("express");

const {
  createMkUser,
  getMkUser,
  updateUserBasedOnNameAndType,
  getUserBasedOnUserType,
} = require("../controllers/mkUserController");
const router = express.Router();

router.post("/", createMkUser);
// router.get("/", getMkUser);
// router.get("/", getUserBasedOnUserType);

router.put("/", updateUserBasedOnNameAndType);

module.exports = router;
