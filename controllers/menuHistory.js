const menuFoodModel = require("../models/menuFoodModel");

const menuHistory = async (req, res) => {
	try {
		const { date } = req.body;

		const menuFood = await menuFoodModel.findOne({ date_of_cooking: date });
		const ashkhasList = menuFood.mohalla_wise_ashkhaas;

		let totalAshkhaas = undefined;
		totalAshkhaas = ashkhasList.reduce(
			(acc, item) => acc.total_ashkhaas + item.total_ashkhaas
		);

		res.status(200).json({ totalAshkhaas });
	} catch (error) {
		res.status(500).json(error);
	}
};

module.exports = {
	menuHistory,
};
