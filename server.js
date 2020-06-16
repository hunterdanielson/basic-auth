require('dotenv').config();
require('./lib/utils/connect')();

const app = require('./lib/app');
const Auction = require('./lib/models/Auction');

const PORT = process.env.PORT || 7890;

setInterval(() => {
  Auction.find({ $lte: { end: Date.now() } })
    .then(//accept the highest bids
    );
}, 1000 * 60 * 60);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});
