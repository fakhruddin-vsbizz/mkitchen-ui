const mongoose = require("mongoose");

const finalizeProcure = mongoose.Schema(
  {
    procure_items: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "please add the contact name"],
    },
    date: {
      type: String,
      required: [true, "please add the contact email"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("finalizeProcure", finalizeProcure);
