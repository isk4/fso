const express = require('express');
const app = express();
const PORT = 3001; 

app.use(express.json());

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

const generateId = (upperLimit) => {
  let id;
  do {
    id = Math.floor(Math.random() * upperLimit) + 1;
    id = String(id);
  } while (persons.find((p) => p.id === id));
  
  return id;
};

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  person ? response.json(person) : response.status(404).end();
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const person = {
    id: generateId(1000),
    name: body.name,
    number: body.number
  };

  persons.push(person);
  response.json(person);
});

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}</p>
    <p>${new Date()}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});