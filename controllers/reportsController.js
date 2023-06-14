const Inventory = require('../models/inventoryItemsModel');
const Purchases = require('../models/purchasesModel');
const expressAsyncHandler = require("express-async-handler");
const Vendor = require('../models/vendorModel');


exports.getTotalItems = expressAsyncHandler(async (req, res) => {
    const today = new Date()

    try {
        var totalCost = 0;
        // var totalExpiredItem = 0;
        const inventory = await Inventory.find()
        const totatItem = inventory.length;

        // const totalCost = inventory.reduce((a,b)=> a+b.price, 0) 

        const purchases = await Purchases.find();

        const filteredPurchases = purchases.filter((purchase) => {
            const [month, day, year] = purchase.expiry_date.split("/");
            const expiryDate = new Date(`${month}/${day}/20${year}`);
            return expiryDate < today && purchase?.unshelf === false;
        });

        console.log(filteredPurchases);
        const response = {
            totatItem: totatItem,
            totalCost: Number(totalCost?.toFixed(2)),
            totalExpiredItem: filteredPurchases.length
        }

        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
    }

})


exports.getPurchaseReport = expressAsyncHandler(async (req, res) => {
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

})

exports.getPurchsedByVendorReport = async (req, res) => {

    let report = []
    const vendors = await Vendor.find();
    const purchases = await Purchases.find({}, `createdAt vendor_id ingredient_name 
    quantity_loaded rate_per_unit paid total_amount`);


    vendors.forEach(item => {

        const id = item._id.toString();

        const vendorPurchase = purchases.filter(p => {
            return p.vendor_id == id
        })

        // inventory.forEach(item => {
        //    const _id = item._id.toString();
        //    const itemName = item.ingredient_name
        //     var totalQty = 0;
        //     var 


        //     const newVendorPurchase = vendorPurchase.filter(vp => {
        //         return vp.ingredient_name = itemName
        //     }).forEach(el =>{
        //     });
        // });


    })
}


dateConverter = (periodUnit, period, createdOn) => {

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