import { useState } from 'react';
import personsService from '../services/persons';

const NewPersonForm = ({ setPersons, findPerson, showNotification }) => {
  const [nameInput, setNameInput] = useState('');
  const [numberInput, setNumberInput] = useState('');

  const handleNameInputChange = (e) => setNameInput(e.target.value);
  const handleNumberInputChange = (e) => setNumberInput(e.target.value);

  const handleAddPerson = async (e) => {
    e.preventDefault();
    const name = nameInput.trim();
    const number = numberInput.trim();
    const foundPerson = findPerson(name);
    const action = foundPerson ? 'update' : 'create';

    try {
      if (action === 'update') {
        const ok = (window.confirm(`"${name}" is already added to phonebook. Replace the old number with a new one?`));
        if (!ok) return;

        const updatedPerson = await personsService.update(foundPerson.id, {...foundPerson, number});
        setPersons((persons) => persons.map((person) => person.id === updatedPerson.id ? updatedPerson : person));
      } else {
        const newPerson = { name, number };
        const createdPerson = await personsService.create(newPerson);
        setPersons((persons) => persons.concat(createdPerson));
      }
      showNotification(`Phonebook entry ${action}d`, 'success');
      setNameInput('');
      setNumberInput('');
    } catch (e) {
      showNotification(`Couldn\'t ${action} phonebook entry. ${e.response?.data?.error}`, 'error');
    }
  };

  return (
    <form>
      <div>
        <span>Name</span>
        <input style={{ marginLeft: 10 }} value={nameInput} onChange={handleNameInputChange} />
      </div>
      <div>
        <span>Number</span>
        <input style={{ marginLeft: 10 }} value={numberInput} onChange={handleNumberInputChange} />
      </div>
      <button type="submit" onClick={handleAddPerson}>Add</button>
    </form>
  );
};

export default NewPersonForm;