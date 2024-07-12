const User = require('../models/User');
const logger = require('../config/logger');  // Import the logger

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            logger.error('User not found for ID:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }
        logger.info('getProfile:', user);
        res.status(200).json({
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        logger.error('Error in getProfile:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            logger.error('User not found for ID:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }
        await user.update(req.body);
        logger.info('updateProfile:', user);
        res.json(user);
    } catch (error) {
        logger.error('Error updating profile:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            logger.error('User not found for ID:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        logger.info('deleteProfile: Profile deleted successfully');
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        logger.error('Error deleting profile:', error);
        res.status(500).json({ message: error.message });
    }
};
