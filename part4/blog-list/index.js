require('dotenv').config();
require('./mongo');

const express = require('express');
const logger = require('./utils/logger');
const { requestLogger } = require('./utils/middleware');

const Blog = require('./models/blog');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const unknownEndpointHandler = (request, response) => {
  response.status(404).end();
};

app.use(unknownEndpointHandler);

const castErrorHandler = (error, _request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(castErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}\n`);
});