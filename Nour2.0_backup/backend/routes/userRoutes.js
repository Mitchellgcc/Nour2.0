const express = require('express');
const {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  checkUserToken,
  getUserProfile,
  getUserNotifications,
  markNotificationAsRead
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Static routes first
router.post('/check-token', checkUserToken);
router.get('/profile', authMiddleware, getUserProfile);
router.get('/notifications', authMiddleware, getUserNotifications);
router.post('/notifications/mark-read', authMiddleware, markNotificationAsRead);

// Dynamic routes
router.post('/', createUser);
router.get('/:id', getUserById);
router.get('/', getAllUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
