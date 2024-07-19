const express = require('express');
const router = express.Router();
const UserFeedback = require('../models/UserFeedback');
const authMiddleware = require('../middlewares/authMiddleware');

// POST endpoint to collect user feedback
router.post('/feedback', authMiddleware, async (req, res) => {
  const { mealId, rating, comments } = req.body;
  const userId = req.user.id;

  if (!userId || !mealId || !rating) {
    return res.status(400).json({ message: 'userId, mealId, and rating are required' });
  }

  try {
    const feedback = new UserFeedback({
      userId,
      mealId,
      rating,
      comments: comments || ''
    });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback', error });
  }
});

// GET endpoint to retrieve feedback for a meal
router.get('/feedback/:mealId', authMiddleware, async (req, res) => {
  const { mealId } = req.params;

  try {
    const feedbacks = await UserFeedback.find({ mealId });
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ message: 'Error retrieving feedback', error });
  }
});

module.exports = router;
