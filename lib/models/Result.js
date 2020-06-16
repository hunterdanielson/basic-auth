const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
    required: true
  }],
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  priceSold: {
    type: String,
    required: true
  },
  quantitySold: {
    type: Number,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Result', schema);
