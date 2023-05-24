const expressAsyncHandler = require("express-async-handler");
const MenuDelivery = require("../../models/menuDeliveryReviewModel");

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

module.exports = { getMohallaReviews };
