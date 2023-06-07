const mongoose = require('mongoose');

const IngredientItemSchema = new mongoose.Schema({
    ingredientId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InventoryItems"
    },
    ingredientName: {
        type: String,
        unique: true
    },
    procured: {
        type: Number,
        default: 0
    },
    leftover: {
        type: Number,
        default: 0
    },
    reorder: {
        type: Number,
        default: 0
    }
})

const foodItemSchema = new mongoose.Schema({
    foodItemId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItems"
    },
    foodName: String,
    ingredients: {
        type: [IngredientItemSchema],
        default:[]
    }
})

module.exports = new mongoose.model("Cookingfooditem", foodItemSchema);


