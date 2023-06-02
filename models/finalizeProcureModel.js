const mongoose = require("mongoose");

const procureItemsSchema = new mongoose.Schema({
  inventoryItemId: {
    type: String,
  },
  ingridientName: {
    type: String,
  },
  total_quantity: {
    type: Number,
  },
  unit: {
    type: String,
  },
  requiredVolume: {
    type: Number,
  },
  sufficient: {
    type: Boolean,
  },
  procured_status: {
    type: Boolean,
    default: false
  }
})

const finalizeProcure = mongoose.Schema(
  {
    menu_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuFood",
      required: true,
    },
    procure_items: {
      type: [procureItemsSchema],
      required: true
    },
    date: {
      type: String,
      required: [true, "please add date"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("finalizeProcure", finalizeProcure);
