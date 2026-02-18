const express = require('express');
const {
  requestLogger,
  unknownEndpointHandler,
  errorHandler,
  tokenExtractor
} = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

app.use(tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(unknownEndpointHandler);
app.use(errorHandler);

module.exports = app;