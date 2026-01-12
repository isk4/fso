const mongoose = require('mongoose');

mongoose.set('strictQuery',false);

const url = process.env.MONGODB_URI;

console.log('connecting to MongoDB...')
try {
  await mongoose.connect(url, { family: 4 });
  console.log('connected to MongoDB');
} catch (e) {
  console.log('error connecting to MongoDB:', e.message);
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    return returnedObject;
  }
});

module.exports = mongoose.model('Person', personSchema);