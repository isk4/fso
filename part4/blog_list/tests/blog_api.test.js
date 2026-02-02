const { test, describe, beforeEach, before, afterEach, after } = require('node:test');
const assert = require('node:assert/strict');
const { connect, close, clear } = require('./db');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const blogsFixture = require('./fixtures/blogs.json');

const api = supertest(app);

before(async () => { await connect(); });
beforeEach(async () => await Blog.insertMany(blogsFixture));
afterEach(async () => { await clear(); });
after(async () => { await close(); });

describe('API', () => {
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
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const blogs = response.body;

    assert.ok(Array.isArray(blogs));
    assert.ok(blogs.every((blog) => Object.hasOwn(blog, 'id') && !Object.hasOwn(blog, '_id')));
  });

  test('POST /api/blogs creates new blog correctly', async () => {
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
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const blogs = getResponse.body;

    assert.strictEqual(blogs.length, blogsFixture.length + 1);
    assert.ok(blogs.some((blog) =>
      blog.title === newBlog.title &&
      blog.author === newBlog.author &&
      blog.url === newBlog.url &&
      blog.id === createdBlog.id
    ));
  });
});