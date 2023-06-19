const Inventory = require('../models/inventoryItemsModel');
const Purchases = require('../models/purchasesModel');
const expressAsyncHandler = require("express-async-handler");
const Vendor = require('../models/vendorModel');


exports.getTotalItems = expressAsyncHandler(async (req, res) => {
    const today = new Date()

    try {
        // let totalCost = 0;
        // var totalExpiredItem = 0;
        const inventory = await Inventory.find()
        const totatItem = inventory.length;

        // totalCost = inventory.reduce((a,b)=> a+b.price, 0)

        const purchases = await Purchases.find();

        const filteredPurchases = purchases.filter((purchase) => {
            const [month, day, year] = purchase.expiry_date.split("/");
            const expiryDate = new Date(`${month}/${day}/20${year}`);
            return expiryDate < today && purchase?.unshelf === false;
        });


        // console.log(filteredPurchases);
        const response = {
            totatItem: totatItem,
            // totalCost: Number(totalCost?.toFixed(2)),
            totalExpiredItem: filteredPurchases.length
        }

        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
    }

})


exports.getPurchaseReport = expressAsyncHandler(async (req, res) => {
    let purchase = [];

    let inventoryCost = 0;

    try {
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

            inventoryCost += (totalPurchases.length * item.price)

            purchase.push(purchasedItem);

        })

        res.status(200).json({ purchase, inventoryCost });

    } catch (error) {
        console.log(error);
    }


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

exports.getAvgCost = expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    let name;
    var totalQty = 0
    var totalCost = 0

    try {
        let item = await Purchases.find({ inventory_id: id })
        item.forEach(i => {
            name = i.ingredient_name;
            totalCost += i.total_amount;
            totalQty += i.quantity_loaded;
        });
        result = {
            name: name,
            _id: id,
            qty: totalQty,
            unitPrice: totalCost / totalQty,
            cost: totalCost
        }

        res.status(200).json(result);

    } catch (error) {
        res.status(400).json(error);
    }
})
