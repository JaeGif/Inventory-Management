const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShoeSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  price: { type: Number },
  description: { type: String },
  size: { type: Number },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
});

// Virtual for shoes' URL
ShoeSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/shoe/${this._id}`;
});

// Export model
module.exports = mongoose.model('Shoe', ShoeSchema);
