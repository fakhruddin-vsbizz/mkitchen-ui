const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventory = require('../models/inventoryItemsModel');

const InventoryItems = inventory.Schema

const donationSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MKUser"
        },
        userType: {
            type: String
        },
        ingredientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InventoryItems"
        },
        ingredientName: {
            type: String,
        },
        donarName: {
            type: String,
        },
        remark: {
            type: String,
        },
        contactNumber: {
            type: String,
        },
        donationQty: {
            type: Number,
            required: true,
        },
        ingridient_measure_unit: {
            type: String,
            required: true,
        },

        its_id: {
            type: Number
        },
    },
    { timestamps: true }
)

exports.donation = mongoose.model('donation', donationSchema);