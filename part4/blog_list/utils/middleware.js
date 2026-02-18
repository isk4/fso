const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body ?? '');
  logger.info('---------------------------');
  next();
};

const unknownEndpointHandler = (request, response) => {
  response.status(404).end();
};

const errorHandler = (error, _request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }


  next(error);
};

const tokenExtractor = (request, _response, next) => {
  const authorization = request.get('authorization');
  request.token = null;

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.slice(7).trim();
  }

  next();
};

module.exports = {
  requestLogger,
  unknownEndpointHandler,
  errorHandler,
  tokenExtractor
};