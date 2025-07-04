import 'dotenv/config';
import app from './app.js';
import pino from 'pino';
import cors from 'cors';
import { initMongoConnection } from './db/initMongoConnection.js';
import { getEnvVariable } from './utils/getEnvVariable.js';

const PORT = getEnvVariable('PORT') || 3000;
const logger = pino();

app.use(cors());
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export const setupServer = async () => {
  try {
    await initMongoConnection();

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error during server startup:', error);
    process.exit(1);
  }
};
