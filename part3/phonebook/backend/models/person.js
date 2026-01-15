const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: String,
    validate: {
      validator: (number) => {
        return /^(?=.{9,}$)\d{2,3}-\d+$/.test(number);
      },
      message: () => 'format should be XX-XXXXXX... or XXX-XXXXX... (8+ digits)',
      required: [true, 'number missing']
    }
  },
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