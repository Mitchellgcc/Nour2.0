const express = require('express');
const { getRecommendations, submitFeedback } = require('../controllers/recommendationController');

const router = express.Router();

router.get('/:userId/recommendations', getRecommendations);
router.post('/:userId/feedback', submitFeedback);

module.exports = router;
