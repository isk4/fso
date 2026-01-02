import { useState } from 'react';

const NewContactForm = ({ contacts, setContacts }) => {
  const [nameInput, setNameInput] = useState('');
  const [numberInput, setNumberInput] = useState('');

  const handleNameInputChange = (e) => setNameInput(e.target.value);
  const handleNumberInputChange = (e) => setNumberInput(e.target.value);
  
  const handleAddContact = (e) => {
    e.preventDefault();
    if (isAlreadyAdded(nameInput)) {
      alert(`"${nameInput}" is already added to phonebook`);
    } else {
      const newContact = { name: nameInput, number: numberInput };
      setContacts(contacts.concat(newContact));
      setNameInput('');
      setNumberInput('');
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