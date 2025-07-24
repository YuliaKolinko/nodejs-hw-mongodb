import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  await loginUser(req.body);
  res.status(200).json({
    status: 200,
    message: 'User logged in successfully',
  }); 