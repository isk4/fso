import { useState } from 'react';

const ContactList = ({ contacts }) => {
  const [search, setSearch] = useState('');

  const startsWith = (str1, str2) => str1.toUpperCase().startsWith(str2.toUpperCase());

  const filteredContacts = search === '' ? contacts : contacts.filter((contact) => startsWith(contact.name, search));

  const handleSearchChange = (e) => setSearch(e.target.value);
  
  const renderPerson = ({ name, number }) => <li key={name}>{name} {number}</li>; 
  
  return (
    <div>
      <span>Search</span>
      <input style={{ marginLeft: 10 }} value={search} onChange={handleSearchChange} />
      <ul>
        { filteredContacts.map((person) => renderPerson(person)) }
      </ul>
    </div>
  );
};

export default ContactList;