const category = require("../models/categories");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all categories
exports.categories_list = asyncHandler(async (req, res, next) => {
    const allCategories = await category.find().sort({ name: 1 }).exec();
    res.render("category_list", {
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
    res.render("category_form", {      
        title: "Create Category",
        selected: 'categories',
        category: undefined,
        errors: undefined,
    });
});

exports.category_create_post = [
    // Validate and sanitize fields.
    body("category_name", "Category name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("category_description", "Category description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const newCategory = new category({
        name: req.body.category_name,
        description: req.body.category_description,
    });

    if(!errors.isEmpty())
    {
        res.render("category_form", {      
            title: "Create Category",
            selected: 'categories',
            category: newCategory,
            errors: errors.array(),
        });
    } else {
        await newCategory.save();
        res.redirect(newCategory.url);
    }
  }),
]

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