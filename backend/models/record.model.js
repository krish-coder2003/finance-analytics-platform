const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please provide the amount'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify the record type (income or expense)'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Record must belong to a user'],
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Soft delete hook: ensures queries automatically ignore deleted items
recordSchema.pre(/^find/, async function() {
  this.find({ isDeleted: { $ne: true } });
});

// Exclude deleted items from aggregation (Dashboard)
recordSchema.pre('aggregate', async function() {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
