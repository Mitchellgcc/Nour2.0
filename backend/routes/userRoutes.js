// backend/routes/userRoutes.js

const express = require('express');
const { createUser, getUserById, getAllUsers, updateUser, deleteUser, checkUserToken } = require('../controllers/userController');
const router = express.Router();

// Create a new user
router.post('/', createUser);

// Read user by ID
router.get('/:id', getUserById);

// Read all users
router.get('/', getAllUsers);

// Update user by ID
router.put('/:id', updateUser);

// Delete user by ID
router.delete('/:id', deleteUser);

// Check user token
router.post('/check-token', checkUserToken);

module.exports = router;
