// ContactForm.jsx

import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, selectContacts } from '../../redux/contactsSlice';
import styles from './ContactForm.module.css';

const ContactForm = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [numberError, setNumberError] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      const parsedContacts = JSON.parse(storedContacts);

      if (JSON.stringify(parsedContacts) !== JSON.stringify(contacts)) {
        dispatch(addContact(parsedContacts));
      }
    }
  }, [contacts, dispatch]);

  const handleSubmit = e => {
    e.preventDefault();

    if (!/^\+?\d+$/.test(number)) {
      setNumberError('Insert correct number');
      return;
    }

    const existingContactWithNumber = contacts.find(
      contact => contact.number === number
    );
    if (existingContactWithNumber) {
      setNameError(
        `This number is assigned to the contact ${existingContactWithNumber.name}`
      );
      return;
    }

    if (
      contacts.some(
        contact => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      setNameError('Contact with this name already exists');
      return;
    }

    const newContact = {
      id: nanoid(),
      name: name,
      number: number,
    };
    const updatedContacts = [...contacts, newContact];
    dispatch(addContact(updatedContacts));
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));

    setName('');
    setNumber('');
    setNameError('');
    setNumberError('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        <span>Name:</span>
        <input
          className={styles.input}
          type="text"
          name="name"
          pattern="^[^\d]+$"
          required
          value={name}
          onChange={e => {
            setName(e.target.value);
            setNameError('');
          }}
        />
        {nameError && <p className={styles['error-message']}>{nameError}</p>}
      </label>
      <label>
        <span>Phone:</span>
        <input
          className={styles.input}
          type="tel"
          name="number"
          pattern="[\d\s()-]+"
          required
          value={number}
          onChange={e => {
            setNumber(e.target.value);
            setNumberError('');
          }}
        />
        {numberError && (
          <p className={styles['error-message']}>{numberError}</p>
        )}
      </label>
      <button className={styles.button} type="submit">
        Add Contact
      </button>
    </form>
  );
};

export default ContactForm;
