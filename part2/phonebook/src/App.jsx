import { useState, useEffect } from 'react';
import NewContactForm from './components/NewContactForm';
import ContactList from './components/ContactList';
import axios from 'axios';

const initialContactList = [
  { name: 'Arto Hellas', number: '040-123456' },
  { name: 'Batman', number: '123-456789' },
  { name: 'Superman', number: '789-456230' },
  { name: 'John Doe', number: '456-789123' },
  { name: 'Lightning McQueen', number: '987-456321' },
  { name: 'Batgirl', number: '784-689156' }
];

const App = () => {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    updateContacts();
  }, []);
  
  const updateContacts = async () => {
    const response = await axios.get('http://localhost:3001/contacts/');
    setContacts(response.data);
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <div>
        <h2>Add new contact</h2>
        <NewContactForm contacts={contacts} setContacts={setContacts}/>
      </div>
      <div>
        <h2>Contacts</h2>
        <ContactList contacts={contacts} />
      </div>
    </div>
  );
};

export default App;