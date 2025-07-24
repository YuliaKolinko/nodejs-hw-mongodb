import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import User from '../models/User.js';
import Session from '../models/Session.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/contacts.js';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: hashedPassword,
  });
};
export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Invalid email or password');
  }
  await Session.deleteMany({ userId: user._id });

  const sessionData = createSession();
  await Session.create(sessionData);
  return sessionData;
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Invalid session or refresh token');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session expired, please log in again');
  }
  const newSession = createSession();
  await Session.deleteOne({ _id: sessionId, refreshToken });
  return await Session.create({
    ...newSession,
    userId: session.userId,
  });
};

export const createContact = async (payload) => {
  const contact = new Contact(payload);
  await contact.save();
  return contact;
};
