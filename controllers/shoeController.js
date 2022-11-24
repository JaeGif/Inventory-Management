const Shoe = require('../models/shoe');
const Category = require('../models/category');
const { body, validationResult } = require('express-validator');

const async = require('async');
const { name } = require('ejs');

exports.index = (req, res) => {
  async.parallel(
    {
      shoe_count(callback) {
        Shoe.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'Climbing Shoe Inventory',
        err: err,
        data: results,
        page: 'home',
      });
    }
  );
};
exports.shoes_list = (req, res, next) => {
  Shoe.find({})
    .populate('category')
    .exec(function (err, list_shoes) {
      if (err) {
        return next(err);
      }
      res.render('index', {
        title: 'All Shoes',
        shoes: list_shoes,
        page: 'shoes',
      });
    });
};
exports.shoe_create_get = (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('index', {
        title: 'Add new shoe',
        categories: results.categories,
        page: 'new-shoe',
      });
    }
  );
};
// Handle shoe create on POST.
exports.shoe_create_post = [
  // Convert the categories to an array.

  // Validate and sanitize fields.
  body('shoe', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('price', 'Please choose a valid price').trim().isNumeric().escape(),
  body('description', 'Filling out a description is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === 'undefined' ? [] : [req.body.category];
    }
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log('errors', errors);
    console.log('body', req.body);

    // Create a shoe object with escaped and trimmed data.
    const shoe = new Shoe({
      name: req.body.shoe,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    });
    console.log(
      'res.object: ',
      req.body.shoe,
      req.body.description,
      req.body.price,
      req.body.category
    );
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      console.log('errors');
      // Get all shoes and categories for form.
      (err, results) => {
        if (err) {
          return next(err);
        }

        res.render('index', {
          title: 'Add new shoe',
          categories: results.categories,
          page: 'new-shoe',
        });
      };
      return;
    }

    // Data from form is valid. Save shoe.
    shoe.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new shoe record.
      res.redirect('/catalog');
    });
  },
];
