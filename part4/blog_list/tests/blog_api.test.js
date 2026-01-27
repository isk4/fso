const { test, describe, before, after, afterEach } = require('node:test');
const { connect, close, clear } = require('./db');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

before(async () => { await connect(); });
afterEach(async () => { await clear(); });
after(async () => { await close(); });

describe('API', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});