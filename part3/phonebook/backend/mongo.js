require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery',false);

const url = process.env.MONGODB_URI;

(async () => {
  try {
    console.log('connecting to MongoDB...');
    await mongoose.connect(url, { family: 4 });
    console.log('connected to MongoDB');
  } catch (e) {
    console.log('error connecting to MongoDB:', e.message);
  }
})();