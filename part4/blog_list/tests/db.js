const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;

const connect = async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
};

const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};

const clear = async () => {
  for (const c of Object.values(mongoose.connection.collections)) {
    await c.deleteMany({});
  }
};

module.exports = { connect, close, clear };

// Usage:

// const { connect, close, clear } = require('./db')

// beforeAll(async () => { await connect() })
// afterEach(async () => { await clear() })
// afterAll(async () => { await close() })
