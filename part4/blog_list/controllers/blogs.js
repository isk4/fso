const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const user = await User.findOne({});

  if (!user) {
    return response.status(500).json({ error: 'no users available' });
  }

  const blog = new Blog({
    ...request.body,
    likes: request.body?.likes ?? 0,
    user: user._id
  });

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'title or url missing' });
  }

  const savedBlog = await blog.save();
  user.blogs.push(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
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