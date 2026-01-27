const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

require('./mongo');

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}\n`);
});