import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:id', isValidId, ctrlWrapper(getContactById));

// POST
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// PATCH
<<<<<<< HEAD
router.patch(
  '/:id',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(patchContactController),
);
export default router;

// DELETE
router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));
=======
router.patch('/:id', ctrlWrapper(patchContactController));

// DELETE
router.delete('/:id', ctrlWrapper(deleteContactController));

export default router;
>>>>>>> hw3-crud
