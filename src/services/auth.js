import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import User from '../models/User.js';
import Session from '../models/Session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/contacts.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const registerUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });

  // приховати пароль у відповіді
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isValid = await bcrypt.compare(payload.password, user.password);
  if (!isValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteMany({ userId: user._id });

  const sessionData = createSession();
  const session = await Session.create({
    ...sessionData,
    userId: user._id,
  });

  return session;
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const oldSession = await Session.findOne({ _id: sessionId, refreshToken });
  if (!oldSession) {
    throw createHttpError(401, 'Invalid session or refresh token');
  }

  const isExpired = new Date() > oldSession.refreshTokenValidUntil;
  if (isExpired) {
    throw createHttpError(401, 'Session expired, please log in again');
  }

  await Session.deleteOne({ _id: sessionId });

  const sessionData = createSession();
  const newSession = await Session.create({
    ...sessionData,
    userId: oldSession.userId,
  });

  return newSession;
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};
