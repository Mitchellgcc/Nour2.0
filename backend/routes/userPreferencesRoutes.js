const express = require('express');
const { getUserPreferences, updateUserPreferences, createOrUpdateUserPreferences, deleteUserPreferences } = require('../controllers/userPreferencesController');
const authMiddleware = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

router.get('/:userId', authMiddleware, getUserPreferences);
router.put('/:userId', authMiddleware, updateUserPreferences);

// Create or Update User Preferences
router.post('/', [
  authMiddleware,
  check('userId').not().isEmpty().withMessage('User ID is required'),
  check('preferredCuisines').isArray().optional(),
  check('healthGoals').isArray().optional().isIn([
    'weight loss', 
    'muscle gain', 
    'maintenance', 
    'endurance', 
    'general health', 
    'cardiovascular health', 
    'improve heart health', 
    'increase muscle mass', 
    'reduce body fat', 
    'improve flexibility', 
    'increase stamina'
  ]).withMessage('Invalid health goal'),
  check('dietaryRestrictions').isArray().optional(),
  check('allergies').isArray().optional(),
  check('macroTargets.proteins').isInt({ min: 0, max: 500 }).optional(),
  check('macroTargets.carbohydrates').isInt({ min: 0, max: 500 }).optional(),
  check('macroTargets.fats').isInt({ min: 0, max: 200 }).optional(),
  check('mealFrequency').isInt({ min: 1, max: 10 }).optional(),
  check('mealTimes').isArray().optional(),
  check('hydrationGoals').isInt({ min: 500, max: 5000 }).optional(),
  check('supplementPreferences').isArray().optional(),
  check('preferredMealTypes').isArray().optional(),
  check('preferredIngredients').isArray().optional(),
  check('dislikedIngredients').isArray().optional(),
  check('fitnessLevel').isIn(['beginner', 'intermediate', 'advanced']).optional(),
  check('preferredActivities').isArray().optional(),
  check('mealtimePreferences').isIn(['early', 'regular', 'late']).optional(),
  check('snackPreferences').isArray().optional(),
  check('alcoholConsumption').isIn(['none', 'occasional', 'moderate', 'regular']).optional(),
  check('caffeineConsumption').isIn(['none', 'low', 'moderate', 'high']).optional(),
  check('sleepQuality').isIn(['poor', 'average', 'good', 'excellent']).optional(),
  check('stressLevel').isIn(['low', 'medium', 'high']).optional()
], createOrUpdateUserPreferences);

// Delete User Preferences
router.delete('/:userId', authMiddleware, deleteUserPreferences);

module.exports = router;
