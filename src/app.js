import express from 'express';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
app.use('/contacts', contactsRouter);
app.use((req, res, next) => {
  res.status(404).json({ status: 404, message: 'Not found' });
});
app.use(errorHandler);
export default app;
