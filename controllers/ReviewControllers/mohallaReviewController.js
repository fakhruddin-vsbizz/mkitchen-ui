const expressAsyncHandler = require("express-async-handler");
const MenuDelivery = require("../../models/menuDeliveryReviewModel");
const OperationalPipeline = require("../../models/operationPipeLineModel");
const getMohallaReviews = expressAsyncHandler(async (req, res) => {
  const { menu_food_id, mkuser_id } = req.body;
  const menuDelivery = await MenuDelivery.find({
    menu_food_id: menu_food_id,
    mkuser_id: mkuser_id,
  });

  if (menuDelivery.length !== 0) {
    res.json(menuDelivery);
  } else {
    res.json({ message: "no review for the given food id" });
  }
});

const getMenuReviewReportForAdmin = expressAsyncHandler(async (req, res) => {
  const { menuFoodId } = req.body;

  try {
    const data = await OperationalPipeline.findOne({
      menu_food_id: menuFoodId,
    });

    const dispatchArray = data.dispatch;
    const result = [];

    dispatchArray.forEach((dispatch) => {
      let totalWeightSum = 0;
      let noOfDeighSum = 0;
      dispatch.dispatch.forEach((innerDispatch) => {
        totalWeightSum += parseInt(innerDispatch.total_weight);
        noOfDeighSum += parseInt(innerDispatch.no_of_deigh);
      });

      const dispatchObj = {
        mk_id: dispatch.mk_id,
        total_weight: totalWeightSum,
        no_of_deigh: noOfDeighSum,
      };
      result.push(dispatchObj);
    });

    return res.status(200).json(result);
  } catch (error) {
    throw new Error("An error occurred while aggregating data");
  }
});

module.exports = { getMohallaReviews, getMenuReviewReportForAdmin };
