import { useState } from 'react';
import contactsService from '../services/contacts';

const ContactList = ({ contacts, setContacts }) => {
  const [search, setSearch] = useState('');

  const startsWith = (str1, str2) => str1.toUpperCase().startsWith(str2.toUpperCase());

  const filteredContacts = search === '' ? contacts : contacts.filter((contact) => startsWith(contact.name, search));

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleDelete = (contact) => {
    if (window.confirm(`Delete "${contact.name}?"`)) {
      contactsService.remove(contact);
      setContacts(contacts.filter((c) => c.id !== contact.id));
    }
  };
  
  const renderContact = (contact) => {
    return (
      <tr key={contact.name}>
        <td>{contact.name}</td>
        <td>{contact.number}</td>
        <td><button onClick={() => handleDelete(contact)}>Delete</button></td>
      </tr>
    );
  }; 
  
  return (
    <div>
      <span>Search</span>
      <input style={{ marginLeft: 10 }} value={search} onChange={handleSearchChange} />
      <table>
        <tbody>
          { filteredContacts.map((contact) => renderContact(contact)) }
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;