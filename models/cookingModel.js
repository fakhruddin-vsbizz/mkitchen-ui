const mongoose = require('mongoose');

const cookingSchema = new mongoose.Schema({
    date: String,
    menuItems: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Cookingfooditem",
        default:[]
    },
})


module.exports = new mongoose.model("Cooking", cookingSchema);