const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const listHelper = require('../utils/list_helper');
const blogs = require('./fixtures/blogs.json');

describe('total likes', () => {
  test('list with one blog returns likes of that blog', () => {
    const result = listHelper.totalLikes([blogs[1]]);
    assert.strictEqual(result, 5);
  });

  test('empty list returns 0', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('total calculated correctly', () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36);
  });
});

describe('favorite blog', () => {
  test('list with one blog returns the blog', () => {
    const result = listHelper.favoriteBlog([blogs[1]]);
    assert.deepStrictEqual(result, {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    });
  });

  test('empty list returns null', () => {
    const result = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(result, null);
  });

  test('favorite blog calculated correctly', () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    });
  });
});

describe('most blogs', () => {
  test('empty list returns null', () => {
    const result = listHelper.mostBlogs([]);
    assert.deepStrictEqual(result, null);
  });

  test('list with one blog returns author of the blog', () => {
    const result = listHelper.mostBlogs([blogs[1]]);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    });
  });

  test('author with most blogs calculated correctly', () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    });
  });
});

describe('most likes', () => {
  test('empty list returns null', () => {
    const result = listHelper.mostLikes([]);
    assert.deepStrictEqual(result, null);
  });

  test('list with one blog returns likes of the blog', () => {
    const result = listHelper.mostLikes([blogs[1]]);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 5
    });
  });

  test('author with most likes calculated correctly', () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    });
  });
});