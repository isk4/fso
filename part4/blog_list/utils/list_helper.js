const dummy = (_blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((result, blog) => {
    return result + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite;
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const blogCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] ?? 0) + 1;
    return acc;
  }, {});

  let resultAuthor = null;
  let resultCount = 0;

  for (const [author, count] of Object.entries(blogCount)) {
    if (count > resultCount) {
      resultAuthor = author;
      resultCount = count;
    }
  }

  return { author: resultAuthor, blogs: resultCount };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likeCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] ?? 0) + blog.likes;
    return acc;
  }, {});

  let resultAuthor = null;
  let resultLikes = 0;

  for (const [author, count] of Object.entries(likeCount)) {
    if (count > resultLikes) {
      resultAuthor = author;
      resultLikes = count;
    }
  }

  return { author: resultAuthor, likes: resultLikes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};