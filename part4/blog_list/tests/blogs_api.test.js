const { test, describe, beforeEach, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const db = require('./db');
const { JWT_SECRET } = require('../utils/config');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const blogsFixture = require('./fixtures/blogs.json');

const api = supertest(app);

// Setup
let userOne; let authTokenOne;
let _userTwo; let authTokenTwo;

const testBlog = {
  title: 'Test Blog',
  author: 'Test Author',
  url: 'https://www.test.com'
};

before(async () => {
  await db.connect();

  const userOneResponse = await api
    .post('/api/users')
    .send({
      username: 'user_one',
      name: 'User One',
      password: 'password'
    });
  userOne = userOneResponse.body;

  const loginResponseOne = await api
    .post('/api/login')
    .send({ username: 'user_one', password: 'password' });
  authTokenOne = loginResponseOne.body.token;

  blogsFixture.forEach((blog) => blog.user = userOne.id);

  await api
    .post('/api/users')
    .send({
      username: 'user_two',
      name: 'User Two',
      password: 'password'
    });

  const loginResponseTwo = await api
    .post('/api/login')
    .send({ username: 'user_two', password: 'password' });
  authTokenTwo = loginResponseTwo.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(blogsFixture);
});

after(async () => await db.close());

// Tests
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
    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authTokenOne}`)
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const createdBlog = postResponse.body;

    const getResponse = await api.get('/api/blogs').expect(200);
    const blogs = getResponse.body;

    assert.strictEqual(blogs.length, blogsFixture.length + 1);
    assert.ok(blogs.some((blog) =>
      blog.title === testBlog.title &&
      blog.author === testBlog.author &&
      blog.url === testBlog.url &&
      blog.id === createdBlog.id
    ));
    assert.strictEqual(createdBlog.user.id, userOne.id);
  });

  test('fails without authentication', async () => {
    const response = await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(401);

    assert.deepStrictEqual(response.body, { error: 'token missing' });
  });

  test('fails with invalid user', async () => {
    const userForToken = {
      username: 'test_user',
      id: new mongoose.Types.ObjectId().toString()
    };

    const token = jwt.sign(
      userForToken,
      JWT_SECRET,
      { expiresIn: 60*60 }
    );

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(401);

    assert.deepStrictEqual(postResponse.body, { error: 'invalid token' });
  });

  test('blog with no likes defaults to 0 likes', async () => {
    const newBlog = { ...testBlog, likes: undefined };

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authTokenOne}`)
      .send(newBlog)
      .expect(201);
    const createdBlog = postResponse.body;

    assert.strictEqual(createdBlog.likes, 0);
  });

  test('blog without title returns bad request', async () => {
    const newBlog = { ...testBlog, title: undefined };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authTokenOne}`)
      .send(newBlog)
      .expect(400);

    const getResponse = await api.get('/api/blogs').expect(200);
    const blogs = getResponse.body;

    assert.strictEqual(blogs.length, blogsFixture.length);
  });

  test('blog without url returns bad request', async () => {
    const newBlog = { ...testBlog, url: undefined };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authTokenOne}`)
      .send(newBlog)
      .expect(400);

    const getResponse = await api.get('/api/blogs').expect(200);
    const blogs = getResponse.body;

    assert.strictEqual(blogs.length, blogsFixture.length);
  });

  test('request without body returns bad request', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authTokenOne}`)
      .expect(400);

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
      .set('Authorization', `Bearer ${authTokenOne}`)
      .expect(204);

    const afterResponse = await api.get('/api/blogs').expect(200);
    const afterBlogs = afterResponse.body;

    assert.strictEqual(deleteResponse.text, '');
    assert.strictEqual(afterBlogs.length, beforeBlogs.length - 1);
    assert.ok(!afterBlogs.some((blog) => blog.id === beforeBlogs[0].id));
  });

  test('fails without authentication', async () => {
    const beforeResponse = await api.get('/api/blogs').expect(200);
    const beforeBlogs = beforeResponse.body;

    await api
      .delete(`/api/blogs/${beforeBlogs[0].id}`)
      .expect(401);

    const afterResponse = await api.get('/api/blogs').expect(200);
    const afterBlogs = afterResponse.body;

    assert.strictEqual(afterBlogs.length, beforeBlogs.length);
  });

  test('fails if user is not the owner of the blog', async () => {
    const beforeResponse = await api.get('/api/blogs').expect(200);
    const beforeBlogs = beforeResponse.body;

    const deleteResponse = await api
      .delete(`/api/blogs/${beforeBlogs[0].id}`)
      .set('Authorization', `Bearer ${authTokenTwo}`)
      .expect(401);

    const afterResponse = await api.get('/api/blogs').expect(200);
    const afterBlogs = afterResponse.body;

    assert.deepStrictEqual(deleteResponse.body, { error: 'invalid token' });
    assert.strictEqual(afterBlogs.length, beforeBlogs.length);
  });

  test('malformatted id returns bad request', async () => {
    const response = await api
      .delete('/api/blogs/123')
      .set('Authorization', `Bearer ${authTokenOne}`)
      .expect(400);

    assert.deepStrictEqual(response.body, { error: 'malformatted id' });
  });

  test('non-existing valid id returns 204 and does not delete', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const exists = await Blog.exists({ _id: id });
    if (exists) throw new Error('Setup error: generated id unexpectedly exists');

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${authTokenOne}`)
      .expect(204);
  });
});

describe('PATCH /api/blogs/:id', () => {
  test('updates a blog\'s likes successfully', async () => {
    const getResponse = await api.get('/api/blogs').expect(200);
    const blog = getResponse.body[0];
    const newLikes = { likes: 10 };

    const patchResponse = await api
      .patch(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${authTokenOne}`)
      .send(newLikes)
      .expect(200);
    const updatedBlog = patchResponse.body;

    assert.strictEqual(updatedBlog.likes, newLikes.likes);
  });

  test('fails if user is not the owner of the blog', async () => {
    const getResponse = await api.get('/api/blogs').expect(200);
    const blog = getResponse.body[0];
    const newLikes = { likes: 1234 };

    const patchResponse = await api
      .patch(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${authTokenTwo}`)
      .send(newLikes)
      .expect(401);

    assert.notStrictEqual(newLikes.likes, blog.likes);
    assert.deepStrictEqual(patchResponse.body, { error: 'invalid token' });
  });

  test('request without likes return bad request', async () => {
    const getResponse = await api.get('/api/blogs').expect(200);
    const blog = getResponse.body[0];

    const patchResponse = await api
      .patch(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${authTokenOne}`)
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
      .set('Authorization', `Bearer ${authTokenOne}`)
      .send(newLikes)
      .expect(400);

    assert.deepStrictEqual(patchResponse.body, { error: 'likes must be a number' });
  });

  test('malformatted id returns bad request', async () => {
    const response = await api
      .patch('/api/blogs/123')
      .set('Authorization', `Bearer ${authTokenOne}`)
      .expect(400);

    assert.deepStrictEqual(response.body, { error: 'malformatted id' });
  });

  test('non-existing valid id returns 404', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const exists = await Blog.exists({ _id: id });
    if (exists) throw new Error('Setup error: generated id unexpectedly exists');

    await api
      .patch(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${authTokenOne}`)
      .expect(404);
  });

  test('request without body returns bad request', async () => {
    const getResponse = await api.get('/api/blogs').expect(200);
    const blog = getResponse.body[0];

    await api
      .patch(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${authTokenOne}`)
      .expect(400);
  });
});