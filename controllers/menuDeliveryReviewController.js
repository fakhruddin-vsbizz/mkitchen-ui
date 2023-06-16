const expressAsyncHandler = require("express-async-handler");
const MKUser = require("../models/mkUserModel");
const FoodMenu = require("../models/menuFoodModel");
const MenuDelivery = require("../models/menuDeliveryReviewModel");
const  OperationPipeline = require("../models/operationPipeLineModel");
const { ObjectId } = require("mongodb");


const addDeliveryReview = expressAsyncHandler(async (req, res) => {
  const {
    mkuser_email,
    date_of_cooking,
    review,
    remark,
    username,
    //get review
    type,
    menu_id,
  } = req.body;

  if (type === "add_review") {
    //getting the id's for the respective user
    const mkUser = await MKUser.findOne({ email: mkuser_email });
    const menuFood = await FoodMenu.findOne({
      date_of_cooking: date_of_cooking,
    });

    if (mkUser && menuFood) {
      const deliveryReview = await MenuDelivery.create({
        mkuser_id: mkUser._id,
        menu_food_id: menuFood._id,
        username,
        review,
        remark,
      });

      if (deliveryReview) {
        res
          .status(201)
          .json({ _id: deliveryReview.id, review: deliveryReview.review });
      } else {
        res.status(400);
        throw new Error("Error creating the delevery review");
      }
    }
    return res.json({ message: "Delevery review added" });
  }

  if (type === "get_review") {
    const { menu_id } = req.body;
    const menuDelivery = await MenuDelivery.aggregate([
      {
        $match: { menu_food_id: new ObjectId(menu_id) }    
      },
      {
        $lookup: {
          from: "mkusers",
          localField: "mkuser_id",
          foreignField: "_id",
          as: "user_data",
        }
      }
    ]);
    const operation_pipeline = await OperationPipeline.findOne({ menu_food_id: menu_id });

    const dispatchData = operation_pipeline?.dispatch

    if (menuDelivery.length === 0 || !operation_pipeline) {
      return res.status(404).json({msg: "not found"})
    }

    // const customData = 

    return res.json({menuDelivery, dispatchData});
  }
});

const getReviewsForMKUser = expressAsyncHandler(async (req, res) => {
  const { mkuser_id } = req.body;

  // Retrieve documents matching the mkuser_id
  try {
    const foodReviews = await MenuDelivery.find({ mkuser_id });

    const data = await Promise.all(
      foodReviews.map(async (doc) => {
        const { menu_food_id, review, remark } = doc;

        const menuFood = await FoodMenu.findOne({ _id: menu_food_id });

        return {
          mkuser_id,
          review,
          remark,
          date_of_cooking: menuFood?.date_of_cooking,
          food_list: menuFood?.food_list,
        };
      })
    );

    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to retrieve documents:", error);
    return res.status(500).json({ error: "Failed to retrieve documents "+error });
  }
});

const getDeliveryReview = expressAsyncHandler(async (req, res) => {
  const menuDelivery = await MenuDelivery.find();
  return res.json(menuDelivery);
});

module.exports = { addDeliveryReview, getDeliveryReview, getReviewsForMKUser };
