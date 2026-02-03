const { test, describe, beforeEach, before, after } = require('node:test');
const assert = require('node:assert/strict');
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
    const response = await api
      .get('/api/blogs')
      .expect(200);
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

    const getResponse = await api
      .get('/api/blogs')
      .expect(200);
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

    const getResponse = await api
      .get('/api/blogs')
      .expect(200);
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

    const getResponse = await api
      .get('/api/blogs')
      .expect(200);
    const blogs = getResponse.body;

    assert.strictEqual(blogs.length, blogsFixture.length);
  });
});