const logger = require('./logger');
const { JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
    return response.status(400).json({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name ===  'JsonWebTokenError' || error.name === 'TokenExpiredError') {
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

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const decodedToken = jwt.verify(request.token, JWT_SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: 'invalid token' });
  }

  request.user = user;
  next();
};

module.exports = {
  requestLogger,
  unknownEndpointHandler,
  errorHandler,
  tokenExtractor,
  userExtractor
};