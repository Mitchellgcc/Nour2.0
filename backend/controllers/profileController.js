const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
    try {
      // console.log("Authenticated user in getProfile:", req.user);
      const user = await User.findByPk(req.user.id);
      if (!user) {
        // console.log("User not found in getProfile");
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({
        name: user.name,
        email: user.email,
        // Add other user details as needed
      });
    } catch (error) {
      console.error("Error in getProfile:", error);
      res.status(500).json({ message: error.message });
    }
  };
  

exports.updateProfile = async (req, res) => {
  // console.log("Updating profile for user:", req.user.id);
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      // console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  // console.log("Deleting profile for user:", req.user.id);
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      // console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: error.message });
  }
};
