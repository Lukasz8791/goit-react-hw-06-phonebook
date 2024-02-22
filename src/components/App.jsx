import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setContacts,
  addContact,
  deleteContact,
  setFilter,
} from '../redux/contactsSlice';
import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';

const App = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts.items);
  const filter = useSelector(state => state.contacts.filter);

  useEffect(() => {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      dispatch(setContacts(JSON.parse(storedContacts)));
    }
  }, [dispatch]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('contacts');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleAddContact = newContact => {
    dispatch(addContact(newContact));
    localStorage.setItem('contacts', JSON.stringify([...contacts, newContact]));
  };

  const handleDeleteContact = id => {
    dispatch(deleteContact(id));
    localStorage.setItem(
      'contacts',
      JSON.stringify(contacts.filter(contact => contact.id !== id))
    );
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <ContactForm addContact={handleAddContact} />
      <h2>Contacts</h2>
      <Filter filter={filter} setFilter={value => dispatch(setFilter(value))} />
      <ContactList
        contacts={contacts}
        filter={filter}
        onDelete={handleDeleteContact}
      />
    </div>
  );
};

export default App;
