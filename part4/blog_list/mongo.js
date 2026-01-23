const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');

mongoose.set('strictQuery',false);

(async () => {
  try {
    logger.info('Connecting to MongoDB...\n');
    await mongoose.connect(config.MONGODB_URI, { family: 4 });
    logger.info('Connected to MongoDB\n');
  } catch (e) {
    logger.error('Error connecting to MongoDB:', e.message);
  }
})();