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
    const blogs = await api.get('/api/blogs');

    assert.strictEqual(blogs.length, blogsFixture.legnth);
  });
});