const express = require('express');
const router = express.Router();

// Require controller modules.
const category_controller = require('../controllers/categoryController');
const shoe_controller = require('../controllers/shoeController');

/// Shoe ROUTES ///

// GET catalog home page.
router.get('/', shoe_controller.index);

// GET all shoes listed.
router.get('/shoes', shoe_controller.shoes_list);

// GET request for creating a Shoe. NOTE This must come before routes that display Shoe (uses id).
router.get('/new-shoe', shoe_controller.shoe_create_get);

// POST request for creating a Shoe.
router.post('/new-shoe', shoe_controller.shoe_create_post);

// GET request to delete a Shoe.
router.delete('/shoes/:id/remove', shoe_controller.shoe_remove_delete);

// POST request to delete a Shoe.
/* router.post('/shoe/:id/remove', shoe_controller.shoe_remove_post);

// GET request to update a Shoe.
router.get('/shoe/:id/update', shoe_controller.shoe_update_get);

// POST request to update a Shoe.
router.post('/shoe/:id/update', shoe_controller.shoe_update_post);

// GET request for one a Shoe.
router.get('/shoe/:id', shoe_controller.shoe_detail);

// GET request for list of all Shoe items.
router.get('/shoes', shoe_controller.shoe_list);

/// CATEGORY ROUTES ///

// GET request for listing all shoes in a category.
router.get('/category/:id', category_controller.category_get);
 */

module.exports = router;
