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
export const patchContactController = async (req, res, next) => {
  const { id } = req.params;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
  }
  const updatedContact = await patchContactService(
    id,
    { ...req.body, photo: photoUrl },
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

export const patchContactPhotoController = async (req, res, next) => {
  const { id } = req.params;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (getEnvVariable('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const result = await updatedContact(id, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }
  res.json({
    status: 200,
    data: photo,
    message: 'Contact photo updated successfully',
  });
};
