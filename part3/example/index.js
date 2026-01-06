const express = require('express');
const app = express();

app.use(express.json());

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello, world!</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);

  note ? response.json(note) : response.status(404).end();
});

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = notes.reduce((max, note) => Math.max(max, note.id), 0);
  return String(maxId + 1);
};

app.post('/api/notes', (request, response) => {
  const body = request.body;
  if (!body.content) return response.status(400).json({ error: 'content missing '});

  const note = { 
    content: body.content,
    important: body.important || false,
    id: generateId() 
  };

  notes.push(note);
  response.json(note);
});

app.patch('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);
  const body = request.body;

  if (body.content) note.content = body.content;
  if (body.important) note.important = body.important;

  response.json(note);
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});