import Contact from '../models/contacts';

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json({
    status: 200,
    data: contacts,
    message: 'Contacts retrieved successfully',
  });
};

export const getContactById = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
      data: null,
    });
  }
  res.json({
    status: 200,
    data: contact,
    message: 'Contact retrieved successfully',
  });
};
