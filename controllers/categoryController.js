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

exports.category_detail = asyncHandler(async (req, res, next) => {
    const categoryDetail = await category.findById(req.params.id).exec();
    
    if(categoryDetail === null)
    {
        // No results
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {      
        title: categoryDetail.name,
        selected: 'categories',
        category: categoryDetail,
    });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'categories',
        items_count: -1,
        categories_count: -1,
    });
});

exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'categories',
        items_count: -1,
        categories_count: -1,
    });
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'categories',
        items_count: -1,
        categories_count: -1,
    });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'categories',
        items_count: -1,
        categories_count: -1,
    });
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'categories',
        items_count: -1,
        categories_count: -1,
    });
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'categories',
        items_count: -1,
        categories_count: -1,
    });
});