import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]);
  const [newName, setNewName] = useState('');

  const handleNameInputChange = (e) => {
    setNewName(e.target.value);
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    setPersons(persons.concat({ name: newName }));
    setNewName('');
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          <span>Name</span>
          <input style={{ marginLeft: 10, marginRight: 20 }} value={newName} onChange={handleNameInputChange} />
          <button type="submit" onClick={handleAddPerson}>Add</button>
        </div>
      </form>
      <div>
        <h2>Numbers</h2>
        <ul>
          { persons.map((person, i) => <li key={person.name + i}>{person.name}</li>) }
        </ul>
      </div>
      <p>Debug: {newName}</p>
    </div>
  );
};

export default App;