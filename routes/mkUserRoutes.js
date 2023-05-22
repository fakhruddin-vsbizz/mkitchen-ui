const express = require("express");

const {
  createMkUser,
  getMkUser,
  updateUserBasedOnNameAndType,
  getUserBasedOnUserType,
  updatePasswordBasedOnEmail,
  updatePasswordAdmin,
} = require("../controllers/mkUserController");
const router = express.Router();

router.post("/", createMkUser);
// router.get("/", getMkUser);
// router.get("/", getUserBasedOnUserType);

router.put("/", updateUserBasedOnNameAndType);
router.put("/update_password", updatePasswordBasedOnEmail);
router.put("/update_admin_password", updatePasswordAdmin);

module.exports = router;
