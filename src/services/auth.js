import { UsersCollection } from '../models/User.js';
export const registerUser = async (payload) => {
  const { username, email, password } = payload;

  return await UsersCollection.create({
    username,
    email,
    password,
  });
};
