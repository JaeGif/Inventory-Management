const Shoe = require('../models/shoe');
const Category = require('../models/category');

const async = require('async');
const { nextTick } = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      shoe_count(callback) {
        Shoe.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'Climbing Shoe Inventory',
        error: err,
        data: results,
        page: '',
      });
    }
  );
};
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
        error: err,
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
        err: undefined,
      });
    });
};
