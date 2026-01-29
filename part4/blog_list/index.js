const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');
const { connectToDB } = require('./utils/db');


(async () => {
  try {
    await connectToDB();
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}\n`);
    });
  } catch {
    logger.error('\nStartup failed');
    process.exit(1);
  }
})();
