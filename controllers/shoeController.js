const Shoe = require('../models/shoe');
const Category = require('../models/category');

const async = require('async');

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
      });
    }
  );
};
