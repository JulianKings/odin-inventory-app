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

exports.item_detail = asyncHandler(async (req, res, next) => {
    const itemDetail = await item.findById(req.params.id).populate("category").exec();
    
    if(itemDetail === null)
    {
        // No results
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_detail", {      
        title: itemDetail.name,
        selected: 'items',
        item: itemDetail,
    });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'items',
        items_count: -1,
        categories_count: -1,
    });
});

exports.item_create_post = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'items',
        items_count: -1,
        categories_count: -1,
    });
});

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'items',
        items_count: -1,
        categories_count: -1,
    });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'items',
        items_count: -1,
        categories_count: -1,
    });
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'items',
        items_count: -1,
        categories_count: -1,
    });
});

exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.render("index", {      
        title: "Place Holder",
        selected: 'items',
        items_count: -1,
        categories_count: -1,
    });
});