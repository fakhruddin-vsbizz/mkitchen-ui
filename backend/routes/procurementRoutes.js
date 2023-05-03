const express = require("express");
const {
  procumentoryOperation,
} = require("../controllers/procurementController");
const router = express.Router();

router.post("/", procumentoryOperation);

module.exports = router;
