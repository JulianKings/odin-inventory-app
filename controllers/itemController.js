const item = require("../models/items");
const category = require('../models/categories');

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// home
exports.home = asyncHandler(async (req, res, next) => {
    const [
      numItems,
      numCategories
    ] = await Promise.all([
      item.countDocuments({}).exec(),
      category.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
      title: "Home Page",
      selected: 'home',
      items_count: numItems,
      categories_count: numCategories,
    })
});


// Display list of all items
exports.items_list = asyncHandler(async (req, res, next) => {
    const allItems = await item.find().sort({ rating: -1 }).populate("category").exec();
    res.render("items_list", {
      title: "Items List",
      selected: 'items',
      items_list: allItems,
    });
});