const Inventory = require('../models/inventoryItemsModel');
const Purchases = require('../models/purchasesModel');


exports.getTotalItems = async (req, res) => {
    const today = new Date()

    var totalCost = 0;
    var totalExpiredItem = 0
    const totatItem = await Inventory.estimatedDocumentCount()
    inventory = await Inventory.find()
    inventory.forEach(item => {
        if (item.total_volume && today.getTime() > dateConverter(item.ingridient_expiry_period,
            item.ingridient_expiry_amount, item.createdAt)) {
            totalExpiredItem++

        }
        const itemCost = item.total_volume * item.price
        totalCost += itemCost;
    });


    const response = {
        totatItem: totatItem,
        totalCost: totalCost,
        totalExpiredItem: totalExpiredItem
    }

    res.status(200).json(response)
}


exports.getPurchaseReport = async (req, res) => {
    let purchase = [];

    const inventory = await Inventory.find();
    const purchases = await Purchases.find();

    inventory.forEach(item => {
        var totalCost = 0;
        const id = item._id

        const totalPurchases = purchases.filter((newItem) => newItem.inventory_id == id.toString());

        totalPurchases.forEach(item => {
            totalCost += item.total_amount;
        })

        const purchasedItem = {
            name: item.ingridient_name,
            totalPurchases: totalPurchases.length,
            totalCost: totalCost,
            basePrice: item.price
        }

        purchase.push(purchasedItem);

    })

    res.status(200).json(purchase);



}


function dateConverter(periodUnit, period, createdOn) {

    let date = new Date();

    switch (periodUnit) {
        case "Days":
            date = new Date(createdOn);
            date.setDate(
                date.getDate() + parseInt(period)
            );

            break;
        case "Months":
            date = new Date(createdOn);
            date.setMonth(
                date.getMonth() + parseInt(period)
            );
            break;
        case "Year":
            date = new Date(createdOn);
            date.setYear(
                date.getYear() + parseInt(period)
            );
            break;

        default:
            break;
    }
    return date.getTime();
}