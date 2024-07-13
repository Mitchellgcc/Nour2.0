// backend/routes/nextMealRoutes.js
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
router.use((req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return next(err);
    }
    if (!user) {
      console.error('Authentication failed:', info.message);
      return res.status(400).json({ message: 'User not authenticated' });
    }
    console.log('Authentication succeeded:', user);
    req.user = user;
    next();
  })(req, res, next);
});

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
