import { useState, useEffect } from 'react';
import NewContactForm from './components/NewContactForm';
import ContactList from './components/ContactList';
import contactsService from './services/contacts';

const App = () => {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    updateContacts();
  }, []);
  
  const updateContacts = async () => setContacts(await contactsService.getAll());
  const findContact = (name) => contacts.find((contact) => contact.name === name);

  return (
    <div>
      <h1>Phonebook</h1>
      <div>
        <h2>Add new contact</h2>
        <NewContactForm contacts={contacts} setContacts={setContacts} findContact={findContact} updateContacts={updateContacts} />
      </div>
      <div>
        <h2>Contacts</h2>
        <ContactList contacts={contacts} setContacts={setContacts} />
      </div>
    </div>
  );
};

export default App;