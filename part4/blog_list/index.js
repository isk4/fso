const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');
const { connectToMongo } = require('./mongo');


(async () => {
  try {
    await connectToMongo();
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}\n`);
    });
  } catch {
    logger.error('\nStartup failed');
    process.exit(1);
  }
})();
