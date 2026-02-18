const dotenv = require('dotenv');

dotenv.config({ quiet: process.env.NODE_ENV === 'test' });

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = { PORT, MONGODB_URI, JWT_SECRET };