const { test, describe, beforeEach, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const db = require('./db');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const blogsFixture = require('./fixtures/blogs.json');

const api = supertest(app);

before(async () => await db.connect());
beforeEach(async () => {
  await db.clear();
  await Blog.insertMany(blogsFixture);
});
after(async () => await db.close());

describe('GET /api/blogs', () => {
  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const blogs = response.body;

    assert.ok(Array.isArray(blogs));
    assert.strictEqual(blogs.length, blogsFixture.length);
  });

  test('blogs unique identifier is named "id", not "_id"', async () => {
    const response = await api.get('/api/blogs').expect(200);
    const blogs = response.body;

    assert.ok(blogs.every((blog) => Object.hasOwn(blog, 'id') && !Object.hasOwn(blog, '_id')));
  });
});

describe('POST /api/blogs', () => {
  test('creates new blog correctly', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://www.test.com'
    };

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const createdBlog = postResponse.body;

    const getResponse = await api.get('/api/blogs').expect(200);
    const blogs = getResponse.body;

    assert.strictEqual(blogs.length, blogsFixture.length + 1);
    assert.ok(blogs.some((blog) =>
      blog.title === newBlog.title &&
      blog.author === newBlog.author &&
      blog.url === newBlog.url &&
      blog.id === createdBlog.id
    ));
  });

  test('blog with no likes defaults to 0 likes', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'https://www.test.com'
    };

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201);
    const createdBlog = postResponse.body;

    assert.strictEqual(createdBlog.likes, 0);
  });

  test('blog without title returns bad request', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'https://www.test.com'
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const getResponse = await api.get('/api/blogs').expect(200);
    const blogs = getResponse.body;

    assert.strictEqual(blogs.length, blogsFixture.length);
  });

  test('blog without url returns bad request', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author'
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const getResponse = await api.get('/api/blogs').expect(200);
    const blogs = getResponse.body;

    assert.strictEqual(blogs.length, blogsFixture.length);
  });

  test('request without body returns bad request', async () => {
    await api.post('/api/blogs').expect(400);

    const getResponse = await api.get('/api/blogs').expect(200);
    const blogs = getResponse.body;

    assert.strictEqual(blogs.length, blogsFixture.length);
  });
});

describe('DELETE /api/blogs/:id', () => {
  test('deletes blog successfully', async () => {
    const beforeResponse = await api.get('/api/blogs').expect(200);
    const beforeBlogs = beforeResponse.body;

    const deleteResponse = await api
      .delete(`/api/blogs/${beforeBlogs[0].id}`)
      .expect(204);

    const afterResponse = await api.get('/api/blogs').expect(200);
    const afterBlogs = afterResponse.body;

    assert.strictEqual(deleteResponse.text, '');
    assert.strictEqual(afterBlogs.length, beforeBlogs.length - 1);
    assert.ok(!afterBlogs.some((blog) => blog.id === beforeBlogs[0].id));
  });

  test('malformatted id returns bad request', async () => {
    const response = await api.delete('/api/blogs/123').expect(400);

    assert.deepStrictEqual(response.body, { error: 'malformatted id' });
  });

  test('non-existing valid id returns 204 and does not delete', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const exists = await Blog.exists({ _id: id });
    if (exists) throw new Error('Setup error: generated id unexpectedly exists');

    await api.delete(`/api/blogs/${id}`).expect(204);
  });
});

describe('PATCH /api/blogs/:id', () => {
  test('updates a blog\'s likes successfully', async () => {
    const getResponse = await api.get('/api/blogs').expect(200);
    const blog = getResponse.body[0];
    const newLikes = { likes: 10 };

    const patchResponse = await api
      .patch(`/api/blogs/${blog.id}`)
      .send(newLikes)
      .expect(200);
    const updatedBlog = patchResponse.body;

    assert.strictEqual(updatedBlog.likes, newLikes.likes);
  });

  test('request without likes return bad request', async () => {
    const getResponse = await api.get('/api/blogs').expect(200);
    const blog = getResponse.body[0];

    const patchResponse = await api
      .patch(`/api/blogs/${blog.id}`)
      .send({})
      .expect(400);

    assert.deepStrictEqual(patchResponse.body, { error: 'likes missing' });
  });

  test('sending non-numeric likes returns bad request', async () => {
    const getResponse = await api.get('/api/blogs').expect(200);
    const blog = getResponse.body[0];
    const newLikes = { likes: 'abc' };

    const patchResponse = await api
      .patch(`/api/blogs/${blog.id}`)
      .send(newLikes)
      .expect(400);

    assert.deepStrictEqual(patchResponse.body, { error: 'likes must be a number' });
  });

  test('malformatted id returns bad request', async () => {
    const response = await api.patch('/api/blogs/123').expect(400);

    assert.deepStrictEqual(response.body, { error: 'malformatted id' });
  });

  test('non-existing valid id returns 404', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const exists = await Blog.exists({ _id: id });
    if (exists) throw new Error('Setup error: generated id unexpectedly exists');

    await api.patch(`/api/blogs/${id}`).expect(404);
  });

  test('request without body returns bad request', async () => {
    const getResponse = await api.get('/api/blogs').expect(200);
    const blog = getResponse.body[0];

    await api.patch(`/api/blogs/${blog.id}`).expect(400);
  });
});