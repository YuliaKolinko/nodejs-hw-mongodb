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
) => {
  const skip = (page - 1) * perPage;
  const totalItems = await Contact.countDocuments(filters);
  const contacts = await Contact.find(filters)
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
export const getContactByIdService = async (id) => {
  const contact = await Contact.findById(id);
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
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
};
