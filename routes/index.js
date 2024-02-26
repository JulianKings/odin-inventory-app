var express = require('express');
var router = express.Router();
var path = require('path');

const multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  });

const upload = multer({ storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.svg' && ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 12 * 1024 * 1024
    }
 })

const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");

// Index page
router.get('/', item_controller.home);

// Item Pages
router.get('/items', item_controller.items_list);
router.get("/item/create", item_controller.item_create_get);
router.post("/item/create", upload.single('image'), item_controller.item_create_post);
router.get("/item/:id/delete", item_controller.item_delete_get);
router.post("/item/:id/delete", item_controller.item_delete_post);
router.get("/item/:id/update", item_controller.item_update_get);
router.post("/item/:id/update", upload.single('image'), item_controller.item_update_post);
router.get("/item/:id", item_controller.item_detail); // last so the route doesn't mess with the rest

// Category pages
router.get('/categories', category_controller.categories_list);
router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);
router.get("/category/:id/delete", category_controller.category_delete_get);
router.post("/category/:id/delete", category_controller.category_delete_post);
router.get("/category/:id/update", category_controller.category_update_get);
router.post("/category/:id/update", category_controller.category_update_post);
router.get("/category/:id", category_controller.category_detail); // last so the route doesn't mess with the rest

module.exports = router;
