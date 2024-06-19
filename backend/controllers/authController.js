const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op, Sequelize } = require('sequelize');

// Generate access and refresh tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30m' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Register user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });
    const { accessToken, refreshToken } = generateTokens(user);
    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), Sequelize.fn('LOWER', email))
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save the session ID to the user's record
    user.sessionId = req.sessionID;
    await user.save();

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh token
exports.refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token missing' });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ accessToken });
  });
};

// Logout user
exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out' });
};
