import { Router } from 'express';
import { getAllContacts, getContactById } from '../controllers/contacts';

const router = Router();

router.get('/', getAllContacts);
router.get('/:id', getContactById);

export default router;
