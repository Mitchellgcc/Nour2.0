const User = require('../models/User');

// Create user
const createUser = async (req, res) => {
  console.log('Creating a new user with data:', req.body);
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
    console.log('User created:', user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Getting user by ID: ${userId}`);
    const user = await User.findByPk(userId);
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  console.log('Getting all users');
  try {
    const users = await User.findAll();
    res.status(200).json(users);
    console.log('Users retrieved:', users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Update user
const updateUser = async (req, res) => {
  console.log('Updating user by ID:', req.params.id);
  console.log('Update data:', req.body);
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(req.body);
    res.status(200).json(user);
    console.log('User updated:', user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  console.log('Deleting user by ID:', req.params.id);
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
    console.log('User deleted');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Check user token
const checkUserToken = async (req, res) => {
  console.log('Checking user token for email:', req.body.email);
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
    console.log('User token checked:', user);
  } catch (error) {
    console.error('Error checking user token:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    console.log('Getting user profile for ID:', req.user.id);
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage', 'timeZone', 'height', 'weight', 'gender', 'dateOfBirth', 'bodyComposition']
    });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};


// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    console.log('Fetching notifications for user ID:', req.user.id);
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.dataValues);

    const notifications = user.notifications || [];
    console.log('User notifications:', notifications);

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);

    // Detailed error logging
    if (error instanceof ValidationError) {
      console.error('Validation error:', error.errors);
    } else if (error instanceof DatabaseError) {
      console.error('Database error:', error.message);
    }

    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.notifications = user.notifications.map(notification =>
      notification.notificationId === notificationId
        ? { ...notification, isRead: true }
        : notification
    );
    await user.save();
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  checkUserToken,
  getUserProfile,
  getUserNotifications,
  markNotificationAsRead
};
