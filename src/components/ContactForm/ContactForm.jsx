import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import { addContact } from '../../redux/contactsSlice';
import styles from './ContactForm.module.css';

const initialState = {
  name: '',
  number: '',
  numberError: '',
  nameError: '',
};

const ContactForm = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.contacts.items);

  const [formData, setFormData] = useState(initialState);

  const { name, number, numberError, nameError } = formData;

  useEffect(() => {
    const storedContacts = localStorage.getItem('contacts');
    if (storedContacts) {
      const parsedContacts = JSON.parse(storedContacts);
      dispatch(addContact(parsedContacts));
    }
  }, [dispatch]);

  const handleSubmit = e => {
    e.preventDefault();

    const phoneRegExp = /^\+?[0-9\s()-]{7,}$/;
    if (!phoneRegExp.test(number)) {
      setFormData({
        ...formData,
        numberError: 'Invalid phone number. Please enter a valid phone number.',
      });
      return;
    }

    const existingContactWithNumber = contacts.find(
      contact => contact.number === number
    );
    if (existingContactWithNumber) {
      setFormData({
        ...formData,
        nameError: `This number is assigned to the contact ${existingContactWithNumber.name}`,
      });
      return;
    }

    const isNameAlreadyExists = contacts.some(
      contact =>
        contact.name && contact.name.toLowerCase() === name.toLowerCase()
    );
    if (isNameAlreadyExists) {
      setFormData({
        ...formData,
        nameError: 'Contact with this name already exists',
      });
      return;
    }

    const newContact = {
      id: nanoid(),
      name: name,
      number: number,
    };
    console.log('Adding new contact:', newContact);

    dispatch(addContact(newContact));
    localStorage.setItem('contacts', JSON.stringify([...contacts, newContact]));

    setFormData(initialState);
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
            setFormData({ ...formData, name: e.target.value, nameError: '' });
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
          required
          value={number}
          onChange={e => {
            setFormData({
              ...formData,
              number: e.target.value,
              numberError: '',
            });
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
