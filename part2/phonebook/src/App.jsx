import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '39-44-5323523' }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const handleNameInputChange = (e) => setNewName(e.target.value);
  const handleNumberInputChange = (e) => setNewNumber(e.target.value);

  const isAlreadyAdded = (name) => {
    return persons.find((person) => person.name === name);
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (isAlreadyAdded(newName)) {
      alert(`"${newName}" is already added to phonebook`);
    } else {
      const newPerson = { name: newName, number: newNumber };
      setPersons(persons.concat(newPerson));
      setNewName('');
      setNewNumber('');
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          <span>Name</span>
          <input style={{ marginLeft: 10 }} value={newName} onChange={handleNameInputChange} />
        </div>
        <div>
          <span>Number</span>
          <input style={{ marginLeft: 10 }} value={newNumber} onChange={handleNumberInputChange} />
        </div>
        <button type="submit" onClick={handleAddPerson}>Add</button>
      </form>
      <div>
        <h2>Numbers</h2>
        <ul>
          { persons.map((person, i) => <li key={person.name + i}>{person.name} {person.number}</li>) }
        </ul>
      </div>
    </div>
  );
};

export default App;