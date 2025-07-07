import express from 'express';
import contactsRouter from './routers/contacts';

const app = express();
app.use(express.json());
app.use('/contacts', contactsRouter);
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});
export default app;
