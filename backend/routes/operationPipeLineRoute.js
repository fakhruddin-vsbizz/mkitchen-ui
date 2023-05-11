const express = require("express");
const {
	addOperationPipeline,
	getOperationPipeline,
	updateOperationPipeline,
} = require("../controllers/operationPipeLineController");

const router = express.Router();

router.post("/", addOperationPipeline);
router.get("/", getOperationPipeline);
router.put("/", updateOperationPipeline);

module.exports = router;
