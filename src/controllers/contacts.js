import createError from 'http-errors';
import { createContact } from '../services/contacts.js';
import { patchContactService } from '../services/contacts.js';
import { deleteContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { getContacts } from '../services/contacts.js';
import { getContactByIdService } from '../services/contacts.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import cloudinary from 'cloudinary';

export const getAllContacts = async (req, res) => {
  const { page, perPage, sortBy, sortOrder, filters } = parsePaginationParams(
    req.query,
  );
  const filtersWithUser = {
    ...filters,
    userId: req.user._id,
  };
  const contacts = await getContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filtersWithUser,
  );
  res.json({
    status: 200,
    data: contacts,
    message: 'Contacts retrieved successfully',
  });
};

export const getContactById = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactByIdService(id, req.user._id);
  res.json({
    status: 200,
    data: contact,
    message: 'Contact retrieved successfully',
  });
};

// POST

export const createContactController = async (req, res) => {
  let photoUrl;
  if (req.file) {
    photoUrl = await saveFileToCloudinary(req.file);
  }

  const newContact = await createContact({
    ...req.body,
    userId: req.user._id,
    ...(photoUrl && { photo: photoUrl }),
  });

  console.log('req.file:', req.file);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH
export const patchContactController = async (req, res) => {
  const { id } = req.params;

  let photoUrl;
  if (req.file) {
    if (getEnvVariable('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(req.file);
    } else {
      photoUrl = await saveFileToUploadDir(req.file);
    }
  }
  const updateData = {
    ...req.body,
    ...(photoUrl && { photo: photoUrl }),
  };
  const updatedContact = await patchContactService(
    id,
    updateData,
    req.user._id,
  );
  res.json({
    status: 200,
    data: updatedContact,
    message: 'Contact updated successfully',
  });
};

// DELETE
export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await deleteContact(id, req.user._id);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};

// Images

export const patchContactPhotoController = async (req, res) => {
  const { id } = req.params;
  if (!req.file) {
    throw createError(400, 'Photo file is required');
  }
  let photoUrl;
  if (photo) {
    if (getEnvVariable('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(req.file);
    } else {
      photoUrl = await saveFileToUploadDir(req.file);
    }
    const updatedContact = await patchContactService(
      id,
      { photo: photoUrl },
      req.user._id,
    );
    res.json({
      status: 200,
      data: updatedContact,
      message: 'Contact photo updated successfully',
    });
  }
};
