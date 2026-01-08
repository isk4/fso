const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

morgan.token('body', (request, response) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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
  const name = request.body?.name?.trim();
  const number = request.body?.number?.trim();

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' });
  }
  
  if (persons.some((p) => p.name.toUpperCase() === name.toUpperCase())) {
    return response.status(409).json({ error: 'name must be unique' });
  }

  const person = {
    id: generateId(1000),
    name,
    number
  };

  persons.push(person);
  response.status(201).json(person);
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