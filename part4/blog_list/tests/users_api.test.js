const { test, describe, beforeEach, before, after } = require('node:test');
const assert = require('node:assert/strict');
const db = require('./db');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

before(async () => await db.connect());
beforeEach(async () => {
  await db.clear();

  const user = new User({
    username: 'test',
    name: 'Test User',
    passwordHash: await bcrypt.hash('password', 10)
  });

  await user.save();
});
after(async () => await db.close());

describe('GET /api/users', () => {
  test('all users are returned as json', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const users = response.body;

    assert.ok(Array.isArray(users));
  });
});

describe('POST /api/users', () => {
  test('creates user successfully', async () => {
    const sentUser = {
      username: 'new_user',
      name: 'New User',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(sentUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('user without username returns bad request', async () => {
    const sentUser = {
      name: 'New User',
      password: 'password'
    };

    const response = await api
      .post('/api/users')
      .send(sentUser)
      .expect(400);

    assert.deepStrictEqual(response.body, { error: 'username or password missing' });
  });

  test('user without password returns bad request', async () => {
    const sentUser = {
      username: 'new_user',
      name: 'New User'
    };

    const response = await api
      .post('/api/users')
      .send(sentUser)
      .expect(400);

    assert.deepStrictEqual(response.body, { error: 'username or password missing' });
  });

  test('username must be unique', async () => {
    const sentUser = {
      username: 'new_user',
      name: 'New User',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(sentUser)
      .expect(201);

    const response = await api
      .post('/api/users')
      .send(sentUser)
      .expect(409);

    assert.deepStrictEqual(response.body, { error: 'username already taken' });
  });

  test('username shorter than three characters returns bad request', async () => {
    const sentUser = {
      username: '12',
      name: 'New User',
      password: 'password'
    };

    const response = await api
      .post('/api/users')
      .send(sentUser)
      .expect(400);

    assert.deepStrictEqual(response.body, { error: 'username and password must be strings with at least 3 characters' });
  });

  test('password shorter than three characters returns bad request', async () => {
    const sentUser = {
      username: 'new_user',
      name: 'New User',
      password: '12'
    };

    const response = await api
      .post('/api/users')
      .send(sentUser)
      .expect(400);

    assert.deepStrictEqual(response.body, { error: 'username and password must be strings with at least 3 characters' });
  });
});