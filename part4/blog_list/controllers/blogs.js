const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', (request, response) => {
  const blog = new Blog({ ...request.body, likes: request.body?.likes ?? 0 });
  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'title or url missing' });
  }

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

blogsRouter.patch('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const likes = request.body?.likes;

  if (!blog) {
    return response.status(404).end();
  }

  if (!likes) {
    return response.status(400).json({ error: 'likes missing' });
  }

  if (isNaN(likes)) {
    return response.status(400).json({ error: 'likes must be a number' });
  }

  blog.likes = likes;
  const savedBlog = await blog.save();
  response.json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

module.exports = blogsRouter;