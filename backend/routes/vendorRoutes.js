const express = require("express");

const { addVendor, getVendor, updateVendor } = require("../controllers/vendorController");
const router = express.Router();

router.post("/", addVendor);
router.get("/", getVendor);
router.put("/", updateVendor);


module.exports = router;
