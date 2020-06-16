require('dotenv').config();
require('./lib/utils/connect')();

const app = require('./lib/app');
const { findClosedAuctions } = require('./lib/utils/closeAuctions');

const PORT = process.env.PORT || 7890;



setInterval(() => {
  // check every hour for which auctions have closed
  findClosedAuctions();
 
}, 1000 * 60 * 60);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});
