const mongoose = require('mongoose');
const logger = require('./utils/logger');

mongoose.set('strictQuery',false);

const url = process.env.MONGODB_URI;

(async () => {
  try {
    logger.info('Connecting to MongoDB...\n');
    await mongoose.connect(url, { family: 4 });
    logger.info('Connected to MongoDB\n');
  } catch (e) {
    logger.error('Error connecting to MongoDB:', e.message);
  }
})();