const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post('/blogs', (request, response) => {
  const blog = new Blog({ ...request.body, likes: request.body.likes ?? 0 });

  if (!Object.hasOwn(blog, 'title') || !Object.hasOwn(blog, 'url')) {
    return response.status(400).json({ error: 'title or url missing' });
  }

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogsRouter;