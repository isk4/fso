const mongoose = require('mongoose');

const config = require('./config');
const logger = require('./logger');

mongoose.set('strictQuery',false);

const connectToDB = async () => {
  try {
    logger.info('Connecting to MongoDB...\n');
    await mongoose.connect(config.MONGODB_URI, { family: 4 });
    logger.info('Connected to MongoDB\n');
  } catch (e) {
    logger.error('Error connecting to MongoDB:', e.message);
    throw e;
  }
};

module.exports = { connectToDB };