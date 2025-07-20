import createError from 'http-errors';
import {
  createContact,
  patchContactService,
  deleteContact,
  getContactByIdService,
  getAllContactsService,
} from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  const contacts = await getAllContactsService();
  res.json({
    status: 200,
    data: contacts,
    message: 'Contacts retrieved successfully',
  });
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactByIdService(id);
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
  const { id } = req.params;
  const updatedContact = await patchContactService(id, req.body);
  res.json({
    status: 200,
    data: updatedContact,
    message: 'Contact updated successfully',
  });
};

// DELETE
export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await deleteContact(id);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};
