// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { v4: isUuid } = require('uuid');
const logger = require('../config/logger');
const { refreshWhoopToken } = require('../services/whoopService');

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const refreshToken = req.header('x-refresh-token');
  logger.debug('Authenticating request with header');

  if (!authHeader) {
      logger.warn('Authorization header missing');
      return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  logger.debug('Extracted token');

  if (!token) {
      logger.warn('No token provided');
      return res.status(401).json({ message: 'No token provided' });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      logger.debug('Token valid');

      if (!decoded.id || !isUuid(decoded.id)) {
          logger.warn('Decoded token is missing user ID or ID is not valid UUID');
          return res.status(401).json({ message: 'User ID is missing or not valid.' });
      }

      const userId = decoded.id.toString();
      const user = await User.findByPk(userId);
      if (!user) {
          logger.warn('User not found for ID');
          return res.status(404).json({ message: 'User not found' });
      }
      logger.debug('User found');

      if (user.whoopTokenExpires && user.whoopTokenExpires < new Date()) {
          logger.debug('Whoop token expired, refreshing token');
          await refreshWhoopToken(userId);
      }

      req.user = user;
      req.user.id = user.id;
      logger.debug('req.user set with ID');

      next();
  } catch (error) {
      logger.error('Error verifying token', error);
      if (error.name === 'TokenExpiredError' && refreshToken) {
          try {
              const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
              logger.debug('Refresh token decoded');
              const userId = decoded.id.toString();
              const user = await User.findByPk(userId);
              if (!user) {
                  logger.warn('User not found for ID');
                  return res.status(404).json({ message: 'User not found' });
              }
              const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
              res.set('x-access-token', accessToken);
              res.set('x-refresh-token', newRefreshToken);
              logger.debug('Token refreshed successfully');
              req.user = user;
              next();
          } catch (refreshError) {
              logger.error('Error refreshing token', refreshError);
              return res.status(401).json({ message: 'Authentication failed. Token refresh failed.' });
          }
      } else {
          logger.error('Invalid token', error);
          res.status(401).json({ message: 'Invalid token' });
      }
  }
};

module.exports = authMiddleware;
