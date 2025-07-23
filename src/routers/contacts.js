import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:id', ctrlWrapper(getContactById));

// POST
router.post('/', ctrlWrapper(createContactController));

// PATCH

router.patch('/:id', ctrlWrapper(patchContactController));

// DELETE
router.delete('/:id', ctrlWrapper(deleteContactController));

export default router;
