const category = require("../models/categories");
const item = require("../models/items");

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
    const [categoryDetail, itemsByCategory] = await Promise.all([
        category.findById(req.params.id).exec(),
        item.find({ category: req.params.id}).exec(),
    ]);
    
    if(categoryDetail === null)
    {
        // No results
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }
    
    res.render("category_delete", {      
        title: 'Delete ' + categoryDetail.name,
        selected: 'categories',
        category: categoryDetail,
        categoryItems: itemsByCategory,
        errors: undefined,
    });
});

exports.category_delete_post = [
    // Validate and sanitize fields.
    body("category_password", "Security password must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const errorsArray = errors.array();

        const [categoryDetail, itemsByCategory] = await Promise.all([
            category.findById(req.body.category_id).exec(),
            item.find({ category: req.body.category_id}).exec(),
        ]);
        
        if(categoryDetail === null)
        {
            // No results
            const err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }

        // check password
        if(req.app.settings.modify_secret_password !== req.body.category_password)
        {
            errorsArray.push({msg: 'Invalid security password'});
        }

        if(errorsArray.length > 0)
        {
            res.render("category_delete", {      
                title: 'Delete ' + categoryDetail.name,
                selected: 'categories',
                category: categoryDetail,
                categoryItems: itemsByCategory,
                errors: errorsArray,
            });
        } else {
            if(itemsByCategory.length > 0)
            {
                res.render("category_delete", {      
                    title: 'Delete ' + categoryDetail.name,
                    selected: 'categories',
                    category: categoryDetail,
                    categoryItems: itemsByCategory,
                    errors: undefined,
                });
            } else {
                await category.findByIdAndDelete(req.body.category_id);
                res.redirect('/categories');
            }
        }
    }),
]

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const categoryDetail = await category.findById(req.params.id).exec();
    
    if(categoryDetail === null)
    {
        // No results
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_form", {      
        title: "Update Category",
        selected: 'categories',
        category: categoryDetail,
        errors: undefined,
    });
});

exports.category_update_post = [
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
        _id: req.params.id, // This is required, or a new ID will be assigned!
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
        const updatedCategory = await category.findByIdAndUpdate(req.params.id, newCategory, {});
        res.redirect(updatedCategory.url);
    }
  }),
]