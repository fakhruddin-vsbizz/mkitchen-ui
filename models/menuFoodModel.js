const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    food_list: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Please add the food list"],
    },
    total_ashkhaas: {
      type: Number,
      required: [true, "Please add the user ashkash "],
    },
    mohalla_wise_ashkhaas: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Please add the data "],
    },
    date_of_cooking: {
      type: String,
      required: [true, "please enter the cooking date"],
    },
    client_name: {
      type: String,
      required: [true, "please enter the client name"],
    },
    reason_for_undelivered: {
      type: String,
      required: false,
    },
    reason_for_reconfirming_menu: {
      type: String,
      default: ""
    },
    menu_reset: {
      type: Boolean,
      required: false,
    },
    jaman_coming: {
      type: Boolean,
      required: false,
    },
    time_till_lieu: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuFood", userModel);
