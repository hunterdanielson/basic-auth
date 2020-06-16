require('dotenv').config();
require('./lib/utils/connect')();

const app = require('./lib/app');
const Auction = require('./lib/models/Auction');
const Bid = require('./lib/models/Bid');

const PORT = process.env.PORT || 7890;

const api_key = 'XXXXXXXXXXXXXXXXXXXXXXX';
const domain = 'www.mydomain.com';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });


setInterval(() => {
  Auction.find({ $lte: { end: Date.now() } })
    .then(//accept the highest bids
    );

  // for sending the email with mailgun
  let emailData;
  const sendEmail = (creator, title, amount, quantity) => 
    emailData = {
      from: 'Buyer@buys.com',
      to: `${creator}`,
      subject: `${title}`,
      text: `Buyer bought ${quantity} of product from your ${title} auction for $${amount}`
    };
 
  mailgun.messages().send(emailData, function(error, body) {
    console.log(body);
  });
}, 1000 * 60 * 60);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});
