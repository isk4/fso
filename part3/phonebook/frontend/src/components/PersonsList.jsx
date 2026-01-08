import { useState } from 'react';
import personsService from '../services/persons';

const PersonsList = ({ persons, setPersons, showNotification }) => {
  const [search, setSearch] = useState('');

  const startsWith = (str1, str2) => str1.toUpperCase().startsWith(str2.toUpperCase());

  const filteredPersons = search === '' ? persons : persons.filter((person) => startsWith(person.name, search));

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleDelete = async (person) => {
    if (!window.confirm(`Delete "${person.name}?"`)) return;

    try {
      await personsService.remove(person.id);
      setPersons((prevPersons) => prevPersons.filter((p) => p.id !== person.id));
      showNotification('Phonebook entry deleted', 'success');
    } catch (e) {
      if (e.response?.status === 404) {
        showNotification('Phonebook entry not found', 'error');
        setPersons((prevPersons) => prevPersons.filter((p) => p.id !== person.id));
      } else {
        showNotification('Couldn\'t delete phonebook entry', 'error');
      }
    }
  };
  
  const renderPerson = (person) => {
    return (
      <tr key={person.name}>
        <td>{person.name}</td>
        <td>{person.number}</td>
        <td><button onClick={() => handleDelete(person)}>Delete</button></td>
      </tr>
    );
  }; 
  
  return (
    <div>
      <span>Search</span>
      <input style={{ marginLeft: 10 }} value={search} onChange={handleSearchChange} />
      <table>
        <tbody>
          { filteredPersons.map((person) => renderPerson(person)) }
        </tbody>
      </table>
    </div>
  );
};

export default PersonsList;