require('dotenv').config();
require('./mongo');

const express = require('express');
const morgan = require('morgan');
const Blog = require('./models/blog');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

morgan.token('body', (request, _response) => {
  return ['POST', 'PUT'].some((method) => method === request.method) ? JSON.stringify(request.body) : '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(castErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});