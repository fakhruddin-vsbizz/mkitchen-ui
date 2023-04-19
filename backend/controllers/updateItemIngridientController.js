const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const IngridientItems = require("../models/ingridientItemsModel");

const updateIngridientItems = expressAsyncHandler(async (req, res) => {
  const { ing_name } = req.body;

  const ingridientItem = await IngridientItems.findOne({
    ingridient_name: ing_name,
  });

  if (ingridientItem) {
    const updateIngridientItem = IngridientItems.findByIdAndUpdate({
      _id: Object(ingridientItem._id),
    });
  }
});
