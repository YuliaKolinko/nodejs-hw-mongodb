import Contact from '../models/contacts.js';
import createError from 'http-errors';

// POST
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

// PATCH
export const patchContactService = async (contactId, updateData) => {
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateData,
    {
      new: true,
    },
  );

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  return updatedContact;
};

// DELETE
export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
