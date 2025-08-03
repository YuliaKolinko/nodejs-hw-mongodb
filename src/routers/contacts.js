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
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import { patchContactPhotoController } from '../controllers/contacts.js';

const router = Router();
router.use(authenticate);
router.get('/', ctrlWrapper(getAllContacts));
router.get('/:id', isValidId, ctrlWrapper(getContactById));

// POST
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// PATCH
router.patch(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

// DELETE
router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));
export default router;

// Images

router.put(
  '/:id/photo',
  isValidId,
  upload.single('photo'),
  ctrlWrapper(patchContactPhotoController),
  validateBody(updateContactSchema),
);

router.patch(
  '/:id/photo',
  isValidId,
  upload.single('photo'),
  ctrlWrapper(patchContactPhotoController),
  validateBody(updateContactSchema),
);
