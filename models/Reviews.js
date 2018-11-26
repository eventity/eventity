const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const reviewSchema = new Schema({
  title: String,
  description: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Reviews = mongoose.model('Reviews', reviewSchema);
module.exports = Reviews;
