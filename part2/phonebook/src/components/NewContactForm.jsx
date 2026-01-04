import { useState } from 'react';
import contactsService from '../services/contacts';

const NewContactForm = ({ contacts, setContacts }) => {
  const [nameInput, setNameInput] = useState('');
  const [numberInput, setNumberInput] = useState('');

  const handleNameInputChange = (e) => setNameInput(e.target.value);
  const handleNumberInputChange = (e) => setNumberInput(e.target.value);

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (isAlreadyAdded(nameInput)) {
      alert(`"${nameInput}" is already added to phonebook`);
    } else {
      setNameInput('');
      setNumberInput('');
      
      const newContact = { name: nameInput, number: numberInput };
      const createdContact = await contactsService.create(newContact);
      setContacts(contacts.concat(createdContact));
    }
  };

  const isAlreadyAdded = (name) => {
    return contacts.find((person) => person.name === name);
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
      <button type="submit" onClick={handleAddContact}>Add</button>
    </form>
  );
};

export default NewContactForm;