const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { refreshWhoopToken } = require('../services/whoopService');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log("Authenticating request with header:", authHeader);

  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log("Extracted token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token valid, decoded user:", decoded);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token", error);
    if (error.name === 'TokenExpiredError') {
      try {
        const newToken = await refreshWhoopToken(req.user.id);
        req.headers['Authorization'] = `Bearer ${newToken}`;
        next();
      } catch (refreshError) {
        console.error("Error refreshing token", refreshError);
        return res.status(401).json({ message: 'Authentication failed' });
      }
    } else {
      console.error("Invalid token", error);
      res.status(401).json({ message: 'Invalid token' });
    }
  }
};

module.exports = authMiddleware;
