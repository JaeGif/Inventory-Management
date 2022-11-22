#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
/*
  if (!userArgs[0].startsWith('mongodb')) {
      console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
      return
  }
  */
var async = require('async');
var Shoe = require('./models/shoe');
var Category = require('./models/category');

var mongoose = require('mongoose');
const category = require('../models/category');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var shoes = [];
var categories = [];

function shoeCreate(name, price, description, size, category, cb) {
  shoeDetail = {
    name: name,
    price: price,
    description: description,
    size: size,
    category: category,
  };

  var shoe = new Shoe(shoeDetail);

  shoe.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Shoe: ' + shoe);
    shoes.push(shoe);
    cb(null, shoe);
  });
}

function categoryCreate(name, cb) {
  var category = new Category({ name: name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate('Well Rounded', callback);
      },
      function (callback) {
        categoryCreate('Bouldering', callback);
      },
      function (callback) {
        categoryCreate('Competition', callback);
      },
      function (callback) {
        categoryCreate('Gym', callback);
      },
      function (callback) {
        categoryCreate('Sport', callback);
      },
      function (callback) {
        categoryCreate('Trad', callback);
      },
    ],
    // optional callback
    cb
  );
}
/* name, price, description, size, quantity, cb */
function createShoes(cb) {
  async.parallel(
    [
      function (callback) {
        shoeCreate(
          'Booster',
          209,
          'Built for bouldering, sport climbing and demanding competitions, the Scarpa Booster climbing shoes have an aggressive, asymmetric shape for sensitive yet supportive, powerful yet precise performance. ',
          40.5,
          [categories[1], categories[3], categories[4]],
          callback
        );
      },
      function (callback) {
        shoeCreate(
          'Boostic',
          207,
          'The Boostic is designed for technical face climbing where underfoot support for continuous micro edging is crucial.',
          40,
          [categories[4]],
          callback
        );
      },
      function (callback) {
        shoeCreate(
          'Chimera',
          207,
          "The new Chimera represents the peak of our current abilities in climbing shoe construction and state of the art materials. This fine-tuned model features a handcrafted multi-panel upper, rubber-wrapped forefoot, aggressively downturned profile and asymmetrical shape with full-length off-set lace closure. The Chimera strikes the perfect blend between power and sensitivity: PCB-Tension™ active rand allows the climber the grab with their feet like an extra set of hands on steep overhangs, while the TPS insert provides edging power and underfoot support when you transition onto more vertical terrain with smaller footholds. The combo of the SRT toe-wrap and strategically placed asymmetric lacing system allow for excellent toe hooking capabilities while also providing a high range of adjustability for a variety of climber's foot shapes and volumes. The Chimera is a perfect choice for sport climbs and boulders that feature a variety of climbing angles.",
          37,
          [categories[1], categories[4]],
          callback
        );
      },
      function (callback) {
        shoeCreate(
          'Drago',
          209,
          'Aggressively downturned and highly asymmetric, with a forefoot wrapped in sticky rubber, the Drago represents the pinnacle of rock shoe construction—specialized, meticulously crafted and refined to perform at the highest level on demanding boulders and steep sport routes.',
          39,
          [categories[1], categories[2], categories[4]],
          callback
        );
      },
      function (callback) {
        shoeCreate(
          'Furia Air',
          209,
          'Sensitivity redefined, the new Furia Air brings a second skin feeling to a climbers foot, featuring a cutting edge design combined with the most advanced materials to create a climbing shoe that allows the foot to be fully engaged when climbing, at an incredibly low weight. The sensitivity and performance of the Furia Air must be experienced to be believed!',
          40.5,
          [categories[1], categories[2], categories[4]],
          callback
        );
      },
      function (callback) {
        shoeCreate(
          'Mago',
          209,
          'Built for bouldering, sport climbing and demanding competitions, the Scarpa Booster climbing shoes have an aggressive, asymmetric shape for sensitive yet supportive, powerful yet precise performance. ',
          40.5,
          [categories[1], categories[2], categories[4]],
          callback
        );
      },
      function (callback) {
        shoeCreate(
          'Vapor',
          175,
          'Our most supportive lace-up, the Vapor is a technical trad shoe that provides serious stability and plush comfort, whether you’re jamming cracks or out on the face. The Vapor’s stiff platform features minimal stitching to increase comfort and eliminate hotspots.',
          48,
          [categories[0], categories[3], categories[4], categories[5]],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createShoes, createCategories],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Shoes: ' + shoes);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
