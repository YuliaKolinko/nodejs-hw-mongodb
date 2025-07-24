import createHttpError from 'http-errors';

import User from '../models/User.js';
import Session from '../models/Session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Authorization header is missing'));
    return;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Invalid authorization format'));
    return;
  }
  const session = await Session.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'Invalid access token'));
    return;
  }
  const user = await User.findById(session.userId);
  if (!user) {
    next(createHttpError(401, 'User not found'));
    if (new Date() > session.accessTokenValidUntil) {
      next(createHttpError(401, 'Access token expired'));
      return;
    }
  }
  req.user = user;
  next();
};
