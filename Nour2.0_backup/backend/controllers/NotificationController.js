const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // UUID is already a string
        const notifications = await Notification.find({ userId });

        if (!notifications.length) {
            return res.status(404).json({ error: 'No notifications found' });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const createNotification = async (req, res) => {
    try {
        const { title, message } = req.body;
        const notification = new Notification({
            userId: req.user.id, // Use the UUID
            title,
            message,
        });

        await notification.save();
        res.status(201).json({ notification });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { getNotifications, createNotification };
