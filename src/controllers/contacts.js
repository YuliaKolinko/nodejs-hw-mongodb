import Contact from '../models/contacts.js';
import createError from 'http-errors';

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find();
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
