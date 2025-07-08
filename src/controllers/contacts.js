import Contact from '../models/contacts.js';
import createError from 'http-errors';
import { createContact } from '../services/contacts.js';
import { patchContactService } from '../services/contacts.js';
import { deleteContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { getContacts } from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const { page, perPage, sortBy, sortOrder } = parsePaginationParams(req.query);
  const contacts = await getContacts(page, perPage, sortBy, sortOrder);
  res.json({
    status: 200,
    data: contacts,
    message: 'Contacts retrieved successfully',
  });
};

export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return createError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    data: contact,
    message: 'Contact retrieved successfully',
  });
};

// POST

export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH
export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await patchContactService(contactId, req.body);

  res.json({
    status: 200,
    data: updatedContact,
    message: 'Contact updated successfully',
  });
};

// DELETE
export const deleteContactController = async (req, res, next) => {
  const { id: contactId } = req.params;
  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    return next(createError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Contact deleted successfully',
    data: deletedContact,
  });
};
