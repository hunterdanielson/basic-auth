const { Router } = require('express');
const Bid = require('../models/Bid');
const { ensureAuth } = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
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
