const express = require('express');
const router = express.Router();
const nextMealController = require('../controllers/nextMealController');
const authMiddleware = require('../middlewares/authMiddleware');
const logger = require('../config/logger');

// Log every incoming request to /api/next-meal
router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

router.get('/', authMiddleware, nextMealController.getNextMeal);
router.post('/swipe-meal', authMiddleware, nextMealController.handleSwipeMeal);
router.post('/favorite-meal', authMiddleware, nextMealController.favoriteMeal);
router.post('/submit-feedback', authMiddleware, nextMealController.submitMealFeedback);
router.post('/get-recommendations', authMiddleware, nextMealController.getRecommendations);
router.post('/update-meal-plan', authMiddleware, nextMealController.updateMealPlan);
router.get('/:id', authMiddleware, nextMealController.getMealById);

module.exports = router;
