require('./mongo');
const express = require('express');

const config = require('./utils/config');
const logger = require('./utils/logger');
const { requestLogger, unknownEndpointHandler, castErrorHandler } = require('./utils/middleware');

const Blog = require('./models/blog');

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

app.use(unknownEndpointHandler);
app.use(castErrorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}\n`);
});