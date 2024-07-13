const express = require('express');
const router = express.Router();
const nextMealController = require('../controllers/nextMealController');
const passport = require('passport');
const logger = require('../config/logger');

// Log every incoming request to /api/next-meal
router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Use passport.authenticate middleware
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', nextMealController.getNextMeal);
router.post('/swipe-meal', nextMealController.handleSwipeMeal);
router.post('/favorite-meal', nextMealController.favoriteMeal);
router.post('/submit-feedback', nextMealController.submitMealFeedback);
router.post('/get-recommendations', nextMealController.getRecommendations);
router.post('/update-meal-plan', nextMealController.updateMealPlan);
router.get('/:id', nextMealController.getMealById);

module.exports = router;
