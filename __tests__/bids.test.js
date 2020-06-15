const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');
const Bids = require('../lib/models/Bid');


describe('bid routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  beforeEach(async() => {
    user = await User.create({
      email: 'fake@fake.com',
      password: 'idk'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('makes a bid via POST', () => {
    return request(app)
      .post('/api/v1/bids')
      .auth('fake@fake.com', 'idk')
      .send({
        price: '$5',
        quantity: 3,
        accepted: false
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          price: '$5',
          quantity: 3,
          accepted: false,
          __v: 0
        });
      });
  });
});
