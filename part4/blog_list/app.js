const express = require('express');
const { requestLogger, unknownEndpointHandler, castErrorHandler } = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

app.use(unknownEndpointHandler);
app.use(castErrorHandler);

module.exports = app;