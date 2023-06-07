const expressAsyncHandler = require("express-async-handler");
const CookingItem = require('../models/cookingFoodItem');

const getAll = expressAsyncHandler(async (req, res) => {
    const foodItem = await CookingItem.find({});
	if (!foodItem) return res.status(404).json({ msg: "no item" });

	res.status(200).json({ res: cooking });
})


const createOne = expressAsyncHandler(async (req, res) => {
    const foodItem = await CookingItem.find(req.body);

	res.status(200).json({ res: foodItem });
})

const getOne = expressAsyncHandler(async (req, res) => {
    const {itemId} = req.body;
    const foodItem = await CookingItem.findById(itemId);
	if (!foodItem) return res.status(404).json({ msg: "no item with this ID" });

	res.status(200).json({ res: foodItem });
})

const addIngredients = expressAsyncHandler(async (req, res) => {

    //itemId: string, IngredientList: [{}]
    const {itemId, IngredientList} = req.body;
    const foodItem = await CookingItem.findByIdAndUpdate(itemId, {ingredients: IngredientList}, {new: true});
	if (!foodItem) return res.status(404).json({ msg: "no item with this ID" });

	res.status(201).json({ res: foodItem });

})

// const updateName = expressAsyncHandler(async (req, res) => {
//     const {itemId, name} = req.body;
//     const foodItem = await CookingItem.findByIdAndUpdate(itemId,{ingredientName: name},{new: true});
// 	if (!foodItem) return res.status(404).json({ msg: "no item with this ID" });

// 	res.status(200).json({ res: foodItem });
// })

const updateProcurement = expressAsyncHandler(async (req, res) => {
    const {itemId, procured} = req.body;
    const foodItem = await CookingItem.findByIdAndUpdate(itemId,{procured},{new: true});
	if (!foodItem) return res.status(404).json({ msg: "no item with this ID" });

	res.status(200).json({ res: foodItem });
})

const updateReorder = expressAsyncHandler(async (req, res) => {
    const {itemId, reorder} = req.body;
    const foodItem = await CookingItem.findByIdAndUpdate(itemId,{reorder},{new: true});
	if (!foodItem) return res.status(404).json({ msg: "no item with this ID" });

	res.status(200).json({ res: foodItem });
})

const updateLeftover = expressAsyncHandler(async (req, res) => {
    const {itemId, leftover} = req.body;
    const foodItem = await CookingItem.findByIdAndUpdate(itemId,{leftover},{new: true});
	if (!foodItem) return res.status(404).json({ msg: "no item with this ID" });

	res.status(200).json({ res: foodItem });
})


module.exports = {
    getAll,
    createOne,
    getOne,
    // updateName,
    updateProcurement,
    updateReorder,
    updateLeftover
};

// [{
//     name,
//     list: [{
//         reorder
//     },{
//         reorder
//     },{
//         reorder
//     }]
// }]