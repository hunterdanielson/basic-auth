const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Auction = require('../lib/models/Auction');
const Bid = require('../lib/models/Bid');


describe('bid routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  let auction;
  beforeEach(async() => {
    user = await User.create({
      email: 'fake@fake.com',
      password: 'idk'
    });

    auction = await Auction.create({
      user: user.id,
      title: 'fake title',
      description: 'fake desc',
      quantity: 5,
      endDate: '160000000000'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('does not makes a bid if closed via POST', () => {
    return request(app)
      .post('/api/v1/bids')
      .auth('fake@fake.com', 'idk')
      .send({
        auction: auction._id,
        price: '$5',
        quantity: 3,
        accepted: false
      })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Auction has ended',
          status: 500
        });
      });
  });
  it('makes a bid via POST', async() => {
    const openAuction = await Auction.create({
      user: user.id,
      title: 'fake title',
      description: 'fake desc',
      quantity: 5,
      endDate: '16000'
    });
    return request(app)
      .post('/api/v1/bids')
      .auth('fake@fake.com', 'idk')
      .send({
        auction: openAuction._id,
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
          auction: openAuction.id,
          user: user.id
        });
      });
  });
  it('can get a bid by id via GET', async() => {
    const bid = await Bid.create({
      user: user._id,
      auction: auction._id,
      price: '$5',
      quantity: 3,
      accepted: false
    });
    return request(app)
      .get(`/api/v1/bids/${bid._id}`)
      .auth('fake@fake.com', 'idk')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: { 
            _id: user.id, 
            email: user.email 
          },
          auction: { 
            _id: auction.id, 
            description: auction.description, 
            title: auction.title 
          },
          price: '$5',
          quantity: 3,
          accepted: false
        });
      });
  });
  it('can delete a bid via DELETE', async() => {
    const bid = await Bid.create({
      user: user._id,
      auction: auction._id,
      price: '$5',
      quantity: 3,
      accepted: false
    });
    return request(app)
      .delete(`/api/v1/bids/${bid._id}`)
      .auth('fake@fake.com', 'idk')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: { 
            _id: user.id, 
            email: user.email 
          },
          auction: { 
            _id: auction.id, 
            description: auction.description, 
            title: auction.title 
          },
          price: '$5',
          quantity: 3,
          accepted: false
        });
      });
  });
});
