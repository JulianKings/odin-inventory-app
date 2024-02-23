const category = require("../models/categories");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all categories
exports.categories_list = asyncHandler(async (req, res, next) => {
    const allCategories = await category.find().sort({ name: 1 }).exec();
    res.render("categories_list", {
      title: "Categories List",
      selected: 'categories',
      categories_list: allCategories,
    });
});