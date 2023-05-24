const mongoose = require("mongoose");

const FoodItems = mongoose.Schema(
  {
    mkuser_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MKUser",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    ingridient_list: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    usage_counter: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodItems", FoodItems);
