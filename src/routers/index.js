import { Router } from 'express';
import authRouter from './auth';
import contactsRouter from './contacts.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/contacts', contactsRouter);

export default router;
