import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const initMongoConnection = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const dbName = process.env.MONGODB_DB;
    const connectionString = `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(connectionString);
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
export { initMongoConnection };
