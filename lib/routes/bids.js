const { Router } = require('express');
const Bid = require('../models/Bid');
const { ensureAuth } = require('../middleware/ensureAuth');
const Auction = require('../models/Auction');

module.exports = Router()
  .post('/', ensureAuth, async(req, res, next) => {
    const now = new Date();
    const auction = await Auction
      .findById(req.body.auction);
    if(auction.endDate > now) {
      Bid
        .findOneAndUpdate({
          price: req.body.price,
          quantity: req.body.quantity
        }, { 
          ...req.body,
          user: req.user._id
        },
        { new: true, upsert: true }
        )
        .then(user => res.send(user))
        .catch(next);
    } else {
      const err = new Error('Auction has ended');
      next(err);
    }
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findById(req.params.id)
      .populate('user')
      .populate('auction', {
        title: true,
        description: true
      })
      .then(bid => res.send(bid))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findByIdAndDelete(req.params.id)
      .populate('user')
      .populate('auction', {
        title: true,
        description: true
      })
      .then(bid => res.send(bid))
      .catch(next);
  });
