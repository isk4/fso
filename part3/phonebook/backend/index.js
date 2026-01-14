require('dotenv').config();
require('./mongo');

const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.static('dist'));

morgan.token('body', (request, response) => {
  return ['POST', 'PUT'].some((method) => method === request.method) ? JSON.stringify(request.body) : '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', async (request, response) => {
  const persons = await Person.find({});
  response.json(persons);
});

app.get('/api/persons/:id', async (request, response) => {
  const person = await Person.findById(request.params.id);

  person ? response.json(person) : response.status(404).end();
});

app.delete('/api/persons/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

app.post('/api/persons', async (request, response) => {
  const name = request.body?.name?.trim();
  const number = request.body?.number?.trim();

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' });
  }
  
  // if (persons.some((p) => p.name.toUpperCase() === name.toUpperCase())) {
  //   return response.status(409).json({ error: 'name must be unique' });
  // }

  const person = new Person({ name, number });

  const savedPerson = await person.save();
  response.json(savedPerson);
});

app.put('/api/persons/:id', async (request, response) => {
  const person = await Person.findById(request.params.id);
  const number = request.body?.number?.trim();

  if (!person) {
    return response.status(404).end();
  } 

  if (!number) {
    return response.status(400).json({ error: 'number missing'});
  }

  person.number = number;
  const updatedPerson = await person.save();

  response.json(updatedPerson);
});

app.get('/info', async (request, response) => {
  const persons = await Person.find({});

  response.send(`
    <p>Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}</p>
    <p>${new Date()}</p>
  `);
});

const unknownEndpointHandler = (request, response) => {
  response.status(404).end();
};

app.use(unknownEndpointHandler);

const castErrorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

app.use(castErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});