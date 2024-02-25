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
    res.render("item_list", {
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
    const allCategories = await category.find().sort({ name: 1 }).exec();
    
    res.render("item_form", {      
        title: "Create Item",
        selected: 'items',
        categories_list: allCategories,
        item: undefined,
        errors: undefined,
    });
});

exports.item_create_post = [
    // Validate and sanitize fields.
    body("item_name", "Item name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_description", "Item description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_price", "Item price must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .isLength({ max: 7 })
        .withMessage('Item price must not exceed 999.999'),
    body("item_category", "Item category must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_amount", "Item stock must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .isLength({ max: 10 })
        .withMessage('Item sock must not exceed 9.999.999.999'), 
    body("item_rating", "Item rating must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .isInt({min: 1, max: 5})
        .withMessage("Rating can't exceed 5."),
    body("item_image", "")
    .trim()
    .optional({ values: "falsy" })
    .escape(),   

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const newItem = new item({
            name: req.body.item_name,
            description: req.body.item_description,
            price: req.body.item_price,
            category: req.body.item_category,
            amount: req.body.item_amount,
            imageUrl: req.body.item_image,
            rating: req.body.item_rating,
        });

        if(!errors.isEmpty())
        {
            const allCategories = await category.find().sort({ name: 1 }).exec();

            res.render("item_form", {      
                title: "Create Item",
                selected: 'items',
                categories_list: allCategories,
                item: newItem,
                errors: errors.array(),
            });
        } else {
            await newItem.save();
            res.redirect(newItem.url);
        }
    }),
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const itemDetail = await item.findById(req.params.id).exec();
    
    if(itemDetail === null)
    {
        // No results
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }
    
    res.render("item_delete", {      
        title: 'Delete ' + itemDetail.name,
        selected: 'items',
        item: itemDetail,
        errors: undefined,
    });
});

exports.item_delete_post = [
    // Validate and sanitize fields.
    body("item_password", "Security password must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const errorsArray = errors.array();

        // check password
        if(req.app.settings.modify_secret_password !== req.body.item_password)
        {
            errorsArray.push({msg: 'Invalid security password'});
        }

        if(errorsArray.length > 0)
        {
            const itemDetail = await item.findById(req.body.item_id).exec();
    
            if(itemDetail === null)
            {
                // No results
                const err = new Error("Item not found");
                err.status = 404;
                return next(err);
            }

            res.render("item_delete", {      
                title: 'Delete ' + itemDetail.name,
                selected: 'items',
                item: itemDetail,
                errors: errorsArray,
            });
        } else {
            await item.findByIdAndDelete(req.body.item_id);
            res.redirect('/items');
        }
}),
]

exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [itemDetail, allCategories] = await Promise.all([
        item.findById(req.params.id).exec(),
        category.find().sort({ name: 1 }).exec()]);

    if(itemDetail === null)
    {
        // No results
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }
    
    res.render("item_form", {      
        title: "Update Item",
        selected: 'items',
        categories_list: allCategories,
        item: itemDetail,
        errors: undefined,
    });
});

exports.item_update_post = [
    // Validate and sanitize fields.
    body("item_name", "Item name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_description", "Item description must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_price", "Item price must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .isLength({ max: 7 })
        .withMessage('Item price must not exceed 999.999'),
    body("item_category", "Item category must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("item_amount", "Item stock must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .isLength({ max: 10 })
        .withMessage('Item sock must not exceed 9.999.999.999'), 
    body("item_rating", "Item rating must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .isInt({min: 1, max: 5})
        .withMessage("Rating can't exceed 5."),
    body("item_image", "")
    .trim()
    .optional({ values: "falsy" })
    .escape(),   

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const newItem = new item({
            name: req.body.item_name,
            description: req.body.item_description,
            price: req.body.item_price,
            category: req.body.item_category,
            amount: req.body.item_amount,
            imageUrl: req.body.item_image,
            rating: req.body.item_rating,
            _id: req.params.id, // This is required, or a new ID will be assigned!
        });

        if(!errors.isEmpty())
        {
            const allCategories = await category.find().sort({ name: 1 }).exec();

            res.render("item_form", {      
                title: "Create Item",
                selected: 'items',
                categories_list: allCategories,
                item: newItem,
                errors: errors.array(),
            });
        } else {
            const updatedItem = await item.findByIdAndUpdate(req.params.id, newItem, {});
            res.redirect(updatedItem.url);
        }
    }),
]