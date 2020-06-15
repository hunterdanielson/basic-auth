const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');


describe('basic-auth routes', () => {
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

  it('makes a auction via POST', () => {
    return request(app)
      .post('/api/v1/auctions')
      .auth('fake@fake.com', 'idk')
      .send({
        title: 'fake title',
        description: 'fake desc',
        quantity: 5,
        endDate: Date.now()
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          title: 'fake title',
          description: 'fake desc',
          quantity: 5,
          endDate: expect.anything(),
          __v: 0
        });
      });
  });
});
