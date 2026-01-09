(async () => {

  const mongoose = require('mongoose');

  if (process.argv.length < 3) {
    console.log('provide a password as an argument');
    process.exit(1);
  }

  const password = process.argv[2];
  const name = process.argv[3];
  const number = process.argv[4];

  const url = `mongodb+srv://example_app:${password}@cluster0.nzphmxv.mongodb.net/phonebook?appName=Cluster0`;

  mongoose.set('strictQuery',false);
  await mongoose.connect(url, { family: 4 });

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Person = mongoose.model('Person', personSchema);

  if (name && number) {
    const person = new Person({ name, number });
    
    await person.save();
    console.log(`added ${person.name} number ${person.number} to phonebook`);
  } else {
    const persons = await Person.find({})
    
    console.log('phonebook:');
    persons.forEach(({ name, number }) => console.log(`${name} ${number}`));
  }

  mongoose.connection.close();

})().catch(console.error);