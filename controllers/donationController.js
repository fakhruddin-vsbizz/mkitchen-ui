const donationModel = require('../models/donationModel');
const Inventory = require('../models/inventoryItemsModel')

const Donation = donationModel.donation;

exports.createDonation = async (req, res) => {

    const donation = new Donation(req.body);
    const ingredientId = req.body.ingredientId;
    const qty = req.body.donationQty;
    try {
        await donation.save();
        const inventory = await Inventory.findById(ingredientId, 'total_volume')
        inStock = inventory.total_volume;
        await Inventory.findByIdAndUpdate(ingredientId, { 'total_volume': inStock + qty })
        res.status(201).json(donation);

    } catch (error) {
        res.status(400).json(error);

    }
}

exports.getAllDonation = async (req, res) => {
    const donation = await Donation.find();
    res.status(200).json(donation)
}