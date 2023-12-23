const express = require("express");
const {
  addOperationPipeline,
  getOperationPipeline,
  updateOperationPipeline,
  changeInventoryAmount,
  changeProcurementAmount,
  getIngredients,
  addTotalPriceToFood,
  getMicsCharges,
  addMicsCharges,
} = require("../controllers/operationPipeLineController");

const router = express.Router();

router.post("/", addOperationPipeline);
router.post("/addMicsCharges", addMicsCharges);
router.post("/getMicsCharges", getMicsCharges);
router.post("/getIngredients", getIngredients);
router.post("/updateInventoryAmount", changeInventoryAmount);
router.post("/changeProcurementAmount", changeProcurementAmount);
router.get("/", getOperationPipeline);
router.post("/getTotalPrices", addTotalPriceToFood);
router.put("/", updateOperationPipeline);

module.exports = router;
