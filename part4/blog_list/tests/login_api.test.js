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

describe('POST /api/login', () => {
  test('successfull login', async () => {
    const loginInfo = {
      username: 'test',
      password: 'password'
    };

    const response = await api
      .post('/api/login')
      .send(loginInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.ok(Object.hasOwn(response.body, 'token'));
  });

  test('wrong username returns unauthorized', async () => {
    const loginInfo = {
      username: 'testing',
      password: 'password'
    };

    const response = await api
      .post('/api/login')
      .send(loginInfo)
      .expect(401);

    assert.deepStrictEqual(response.body, { error: 'invalid username or password' });
  });

  test('wrong password returns unauthorized', async () => {
    const loginInfo = {
      username: 'test',
      password: 'wrong_password'
    };

    const response = await api
      .post('/api/login')
      .send(loginInfo)
      .expect(401);

    assert.deepStrictEqual(response.body, { error: 'invalid username or password' });
  });
});