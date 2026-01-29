const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;

const connect = async () => {
  if (mongoose.connection.readyState === 1) return;
  mongo = mongo ?? await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
};

const clear = async () => {
  if (mongoose.connection.readyState !== 1) return;
  for (const collection of Object.values(mongoose.connection.collections)) {
    await collection.deleteMany({});
  }
};

const close = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  if (mongo) {
    await mongo.stop();
    mongo = undefined;
  }
};

module.exports = { connect, clear, close };