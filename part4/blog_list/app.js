const express = require('express');
const { requestLogger, unknownEndpointHandler, castErrorHandler } = require('./utils/middleware');
const blogsRouter = require('./controllers/blogs');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

app.use('/api', blogsRouter);

app.use(unknownEndpointHandler);
app.use(castErrorHandler);

module.exports = app;