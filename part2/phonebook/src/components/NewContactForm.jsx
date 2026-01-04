import { useState } from 'react';
import contactsService from '../services/contacts';

const NewContactForm = ({ setContacts, findContact }) => {
  const [nameInput, setNameInput] = useState('');
  const [numberInput, setNumberInput] = useState('');

  const handleNameInputChange = (e) => setNameInput(e.target.value);
  const handleNumberInputChange = (e) => setNumberInput(e.target.value);

  const handleAddContact = async (e) => {
    e.preventDefault();
    setNameInput('');
    setNumberInput('');
    const foundContact = findContact(nameInput);

    if (foundContact) {
      if (window.confirm(`"${nameInput}" is already added to phonebook. Replace the old number with the a one?`)) {
        const updatedContact = await contactsService.update(foundContact.id, {...foundContact, number: numberInput});
        
        setContacts((contacts) => {
          return contacts.map((contact) => contact.id === updatedContact.id ? updatedContact : contact);
        });
      }
    } else {
      const newContact = { name: nameInput, number: numberInput };
      const createdContact = await contactsService.create(newContact);
      
      setContacts((contacts) => contacts.concat(createdContact));
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
      <button type="submit" onClick={handleAddContact}>Add</button>
    </form>
  );
};

export default NewContactForm;