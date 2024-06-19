// backend/controllers/recommendationController.js
const { getRecommendations } = require('../services/recommendationEngine');
const User = require('../models/User');

const getRecommendationsController = async (req, res) => {
    const { userId } = req.params;
    try {
        const recommendations = await getRecommendations(userId);
        if (!recommendations) {
            return res.status(404).json({ error: 'No recommendations found for the user' });
        }
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
};

const submitFeedbackController = async (req, res) => {
    const { userId } = req.params;
    const { feedback } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentFeedback = user.feedback || [];
        currentFeedback.push(feedback);

        await user.update({ feedback: currentFeedback });

        res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};

module.exports = {
    getRecommendations: getRecommendationsController,
    submitFeedback: submitFeedbackController,
};
