import Contact from '../models/contacts.js';
import createError from 'http-errors';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

// Get all contacts with pagination
export const getContacts = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filters,
  userId,
) => {
  const skip = (page - 1) * perPage;
  const query = filters;
  const totalItems = await Contact.countDocuments(query);
  const contacts = await Contact.find(query)
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page < Math.ceil(totalItems / perPage),
  };
};

// GET
export const getAllContactsService = async () => {
  const contacts = await Contact.find();
  return contacts;
};

// GET by ID
export const getContactByIdService = async (id, userId) => {
  const contact = await Contact.findOne({ _id: id, userId });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
};
// POST
export const createContact = async (payload) => {
  const contact = new Contact(payload);
  await contact.save();
  return contact;
};

// PATCH
export const patchContactService = async (contactId, updateData, userId) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
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
export const deleteContact = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return deletedContact;
};
