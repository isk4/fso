const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

const threeCharString = (input) => {
  return typeof input === 'string' && input.length >= 3;
};

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1
    });
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: 'username or password missing' });
  }

  if (!threeCharString(username) || !threeCharString(password)) {
    return response.status(400).json({ error: 'username and password must be strings with at least 3 characters' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (e) {
    if (e.name === 'MongoServerError' && e.message.includes('E11000 duplicate key error')) {
      return response.status(409).json({ error: 'username already taken' });
    }
  }

});

module.exports = usersRouter;