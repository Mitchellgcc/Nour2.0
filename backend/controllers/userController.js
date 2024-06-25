// backend/controllers/userController.js

const User = require('../models/User');

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

const getUserById = async (req, res) => {
  console.log('Getting user by ID:', req.params.id);
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
    console.log('User retrieved:', user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

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

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  checkUserToken
};
