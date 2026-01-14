import { useState, useEffect } from 'react';
import { NewPersonForm, PersonsList, Notification } from './components/';
import personsService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => { updatePersons() }, []);
  
  const updatePersons = async () => setPersons(await personsService.getAll());
  const showNotification = (message, type) => {
    setNotification({message, type});
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div>
      { notification && <Notification notification={notification} /> }
      <h1>Phonebook</h1>
      <div>
        <h2>Add new entry</h2>
        <NewPersonForm 
          persons={persons} 
          setPersons={setPersons} 
          showNotification={showNotification} />
      </div>
      <div>
        <h2>Entries</h2>
        <PersonsList 
          persons={persons} 
          setPersons={setPersons}
          showNotification={showNotification} />
      </div>
    </div>
  );
};

export default App;