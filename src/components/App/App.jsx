import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContactForm from '../ContactForm/ContactForm';
import ContactList from '../ContactList/ContactList';
import Filter from '../Filter/Filter';
import { addContact, deleteContact } from '../../redux/contactsSlice';
import { setFilter } from '../../redux/filtersSlice';

const App = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts.items) || [];
  const filter = useSelector(state => state.filters.filter);

  const addContactHandler = newContact => {
    dispatch(addContact(newContact));
  };

  const deleteContactHandler = contactId => {
    dispatch(deleteContact(contactId));
  };

  const changeFilterHandler = newFilter => {
    dispatch(setFilter(newFilter));
  };

  const filteredContacts = contacts
    ? contacts.filter(
        contact =>
          contact.name &&
          contact.name.toLowerCase().includes(filter && filter.toLowerCase())
      )
    : [];

  return (
    <div>
      <h1>Phonebook</h1>
      <ContactForm onAddContact={addContactHandler} />
      <h2>Contacts</h2>
      <Filter filter={filter} setFilter={changeFilterHandler} />
      <ContactList
        contacts={filteredContacts}
        onDeleteContact={deleteContactHandler}
      />
    </div>
  );
};

export default App;
