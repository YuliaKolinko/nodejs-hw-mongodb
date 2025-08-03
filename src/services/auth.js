import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import User from '../models/User.js';
import Session from '../models/Session.js';
import {
  FIFTEEN_MINUTES,
  ONE_DAY,
  TEMPLATES_DIR,
} from '../constants/contacts.js';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/contacts.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'node:fs/promises';

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

// Скидання пароля
export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVariable('JWT_SECRET'),
    { expiresIn: '15m' },
  );
  console.log('Reset token for testing:', resetToken);
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVariable('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVariable(SMTP.SMTP_FROM),
    to: email,
    subject: 'Password Reset Request',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, getEnvVariable('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 5);
  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};
