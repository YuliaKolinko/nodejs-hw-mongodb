import Contact from '../models/contacts.js';
import createError from 'http-errors';

export const createContact = async (payload) => {
  if (!payload) {
    throw createError(400, 'Missing request body');
  }
  const { name, phoneNumber, contactType } = payload;
  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      'Missing required fields: name, phoneNumber, or contactType',
    );
  }
  const contact = new Contact(payload);
  await contact.save();
  return contact;
};
