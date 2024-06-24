// backend/controllers/userController.js

const User = require('../models/User');

// Check user token
const checkUserToken = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Export the controller methods
module.exports = {
  checkUserToken,
};
