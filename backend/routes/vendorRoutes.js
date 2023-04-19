const express = require("express");

const { addVendor, getVendor } = require("../controllers/vendorController");
const router = express.Router();

router.post("/", addVendor);
router.get("/", getVendor);

module.exports = router;
