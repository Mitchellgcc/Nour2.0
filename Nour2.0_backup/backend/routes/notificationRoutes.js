const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/NotificationController');

router.get('/notifications', authMiddleware, notificationController.getNotifications);
router.post('/notifications', authMiddleware, notificationController.createNotification);

module.exports = router;
