const Auction = require('./lib/models/Auction');
const Bid = require('./lib/models/Bid');
const Result = require('./lib/models/Result');

const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

const sendEmail = (creator, title, amount, quantity) => {
  return {
    from: 'Buyer@buys.com',
    to: `${creator}`,
    subject: `${title}`,
    text: `Buyer bought ${quantity} of product from your ${title} auction for ${amount}`
  };
};

const findClosedAuctions = async() => {
  const auctions = await Auction.find({ $lte: { end: Date.now() } });

  return Promise.all(auctions.map(async(auction) => {
    const bidsToClose = Bid
      .find({ auction: auction })
      .sort({ price: 'decsending' });
    
    //vars are global scope
    var amountToSell = auction.quantity;
    var saleAmount = 0;
    var saleQuantity = 0;

    Promise.all(
      bidsToClose.map(bid => {
        if(bid.quantity < amountToSell) {
          amountToSell -= bid.quantity;
          saleQuantity += bid.quantity;
          saleAmount += bid.quantity * bid.price;
          const emailData = sendEmail(auction.user, auction.title, saleQuantity, saleAmount);
          console.log(emailData);
          mailgun.messages().send(emailData, function(error, body) {
            console.log(body);
          });
          Bid.findOneAndUpdate({ accepted: true }, bid, { new: true, upsert:true });

        }
      })
    );
    const bidsAccepted = await Bid.find({ auction: auction.id, accepted: true });
    return Result.create({
      auction: auction.id,
      priceSold: saleAmount,
      quantitySold: saleQuantity,
      bid: bidsAccepted
    });
  }
  ));
};

module.exports = {
  findClosedAuctions,
  sendEmail
};
