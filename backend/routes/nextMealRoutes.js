// backend/routes/nextMealRoutes.js
const express = require('express');
const router = express.Router();
const nextMealController = require('../controllers/nextMealController');
const passport = require('passport');
const logger = require('../config/logger');
const authMiddleware = require('../middlewares/authMiddleware'); // Ensure this is imported

// Log every incoming request to /api/next-meal
router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Apply authentication middleware
router.use(authMiddleware);

router.get('/', (req, res, next) => {
  console.log('Authenticated User:', req.user); // Add this line to debug
  next();
}, nextMealController.getNextMeal);

router.post('/swipe-meal', nextMealController.handleSwipeMeal);
router.post('/favorite-meal', nextMealController.favoriteMeal);
router.post('/submit-feedback', nextMealController.submitMealFeedback);
router.post('/get-recommendations', nextMealController.getRecommendations);
router.post('/update-meal-plan', nextMealController.updateMealPlan);
router.get('/:id', nextMealController.getMealById);

module.exports = router;
