var express = require('express');
var router = express.Router();

const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

// Index page
router.get('/', item_controller.home);

// Item Pages
router.get('/items', item_controller.items_list);

// Category pages
router.get('/categories', category_controller.categories_list)

module.exports = router;
