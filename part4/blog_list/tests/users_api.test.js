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