const { Router } = require('express');
const Bid = require('../models/Bid');
const { ensureAuth } = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Bid
      .findOneAndUpdate({
        price: req.body.price,
        quantity: req.body.quantity,
        accepted: req.body.accepted
      })
      .then(user => res.send(user))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    Bid
      .findById(req.params.id)
      .populate('users', 'auctions')
      .then(auction => res.send(auction))
      .catch(next);
  })
  .delete('./:id', ensureAuth, (req, res, next) => {
    Bid
      .findByIdAndDelete(req.params.id)
      .then(bid => res.send(bid))
      .catch(next);
  });
