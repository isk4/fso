import { useState } from 'react';
import contactsService from '../services/contacts';

const NewContactForm = ({ setContacts, findContact, showNotification }) => {
  const [nameInput, setNameInput] = useState('');
  const [numberInput, setNumberInput] = useState('');

  const handleNameInputChange = (e) => setNameInput(e.target.value);
  const handleNumberInputChange = (e) => setNumberInput(e.target.value);

  const handleAddContact = async (e) => {
    e.preventDefault();
    const name = nameInput.trim();
    const number = numberInput.trim();
    const foundContact = findContact(name);

    try {
      if (foundContact) {
        const ok = (window.confirm(`"${name}" is already added to phonebook. Replace the old number with a new one?`));
        if (!ok) return;
        
        const updatedContact = await contactsService.update(foundContact.id, {...foundContact, number});

        setContacts((contacts) => contacts.map((contact) => contact.id === updatedContact.id ? updatedContact : contact));
        showNotification('Contact updated succesfully', 'success');
      } else {
        const newContact = { name, number };
        const createdContact = await contactsService.create(newContact);
        
        setContacts((contacts) => contacts.concat(createdContact));
        showNotification('Contact created succesfully', 'success');
      }
      setNameInput('');
      setNumberInput('');
    } catch (e) {
      showNotification(foundContact ? 'Couldn\'t update contact' : 'Couldn\'t create contact', 'error');
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