import { useState } from 'react';

const people = [
  { name: 'Arto Hellas', number: '040-123456' },
  { name: 'Batman', number: '123-456789' },
  { name: 'Superman', number: '789-456230' },
  { name: 'John Doe', number: '456-789123' },
  { name: 'Lightning McQueen', number: '987-456321' },
  { name: 'Batgirl', number: '784-689156' }
];

const App = () => {
  const [persons, setPersons] = useState(people);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  const handleNameInputChange = (e) => setNewName(e.target.value);
  const handleNumberInputChange = (e) => setNewNumber(e.target.value);
  const handleSearchChange = (e) => setSearch(e.target.value);

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

  const searchPersons = () => {
    if (search === '') return persons;
    return persons.filter((person) => person.name.toLowerCase().startsWith(search.toLowerCase()));
  };

  const renderPerson = ({ name, number }) => <li key={name}>{name} {number}</li>; 

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
        <div>
          <span>Search</span>
          <input style={{ marginLeft: 10 }} value={search} onChange={handleSearchChange} />
        </div>
        <ul>
          { searchPersons().map((person) => renderPerson(person)) }
        </ul>
      </div>
    </div>
  );
};

export default App;