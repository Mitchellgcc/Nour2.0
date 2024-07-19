const Notification = require('../models/Notification');

const sendNotification = async (userId, title, message) => {
    const notification = new Notification({
        userId,
        title,
        message,
    });
    await notification.save();
    return notification;
};

module.exports = {
    sendNotification,
};
