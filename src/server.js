import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { getEnvVariable } from './utils/getEnvVariable.js';

const app = express();
const PORT = getEnvVariable('PORT') || 3000;
const logger = pino();

app.use(cors());
app.use(express.json());

app.use('/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Not found' });
});

app.use(errorHandler);

const start = async () => {
  try {
    await initMongoConnection();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
