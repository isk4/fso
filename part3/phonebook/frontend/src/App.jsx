import { useState, useEffect } from 'react';
import { NewContactForm, ContactList, Notification } from './components/';
import contactsService from './services/contacts';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => { updateContacts() }, []);
  
  const updateContacts = async () => setContacts(await contactsService.getAll());
  const findContact = (name) => contacts.find((contact) => contact.name === name);
  const showNotification = (message, type) => {
    setNotification({message, type});
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div>
      { notification && <Notification notification={notification} /> }
      <h1>Phonebook</h1>
      <div>
        <h2>Add new contact</h2>
        <NewContactForm 
          contacts={contacts} 
          setContacts={setContacts} 
          findContact={findContact}
          showNotification={showNotification} />
      </div>
      <div>
        <h2>Contacts</h2>
        <ContactList 
          contacts={contacts} 
          setContacts={setContacts}
          showNotification={showNotification} />
      </div>
    </div>
  );
};

export default App;