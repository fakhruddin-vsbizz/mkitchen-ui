const express = require("express");
const {
	addOperationPipeline,
	getOperationPipeline,
	updateOperationPipeline,
	changeInventoryAmount,
	changeProcurementAmount
} = require("../controllers/operationPipeLineController");

const router = express.Router();

router.post("/", addOperationPipeline);
router.post("/updateInventoryAmount", changeInventoryAmount);
router.post("/changeProcurementAmount", changeProcurementAmount);
router.get("/", getOperationPipeline);
router.put("/", updateOperationPipeline);

module.exports = router;
