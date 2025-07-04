import express from 'express';
import { Contacts } from './models/contacts.js';

const app = express();
app.use(express.json());
app.get('/contacts', async (req, res) => {
  const contacts = await Contacts.find();
  res.json({
    status: 200,
    data: contacts,
    message: 'Contacts retrieved successfully',
  });
});

app.get('/contacts/:id', async (req, res) => {
  const contact = await Contacts.findById(req.params.id);
  if (contact === null) {
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
});

app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    message: 'Not Found',
  });
});

export default app;
