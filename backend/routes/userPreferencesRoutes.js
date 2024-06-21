const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserPreferences');
const { check, validationResult } = require('express-validator');

// Create or Update User Preferences
router.post('/preferences', [
  check('userId').not().isEmpty().withMessage('User ID is required'),
  check('preferredCuisines').isArray().optional(),
  check('healthGoals').isIn(['weight loss', 'muscle gain', 'maintenance', 'endurance', 'general health', 'cardiovascular health']).optional(),
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
  check('fitnessLevel').isIn(['beginner', 'intermediate', 'advanced']).optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    userId,
    preferredCuisines,
    healthGoals,
    dietaryRestrictions,
    allergies,
    macroTargets,
    mealFrequency,
    mealTimes,
    hydrationGoals,
    supplementPreferences,
    preferredMealTypes,
    preferredIngredients,
    fitnessLevel
  } = req.body;

  try {
    let userPreferences = await UserPreferences.findOne({ userId });

    if (userPreferences) {
      // Update existing preferences
      userPreferences.preferredCuisines = preferredCuisines || userPreferences.preferredCuisines;
      userPreferences.healthGoals = healthGoals || userPreferences.healthGoals;
      userPreferences.dietaryRestrictions = dietaryRestrictions || userPreferences.dietaryRestrictions;
      userPreferences.allergies = allergies || userPreferences.allergies;
      userPreferences.macroTargets = macroTargets || userPreferences.macroTargets;
      userPreferences.mealFrequency = mealFrequency || userPreferences.mealFrequency;
      userPreferences.mealTimes = mealTimes || userPreferences.mealTimes;
      userPreferences.hydrationGoals = hydrationGoals || userPreferences.hydrationGoals;
      userPreferences.supplementPreferences = supplementPreferences || userPreferences.supplementPreferences;
      userPreferences.preferredMealTypes = preferredMealTypes || userPreferences.preferredMealTypes;
      userPreferences.preferredIngredients = preferredIngredients || userPreferences.preferredIngredients;
      userPreferences.fitnessLevel = fitnessLevel || userPreferences.fitnessLevel;
    } else {
      // Create new preferences
      userPreferences = new UserPreferences({
        userId,
        preferredCuisines,
        healthGoals,
        dietaryRestrictions,
        allergies,
        macroTargets,
        mealFrequency,
        mealTimes,
        hydrationGoals,
        supplementPreferences,
        preferredMealTypes,
        preferredIngredients,
        fitnessLevel
      });
    }

    await userPreferences.save();
    res.status(200).json({ message: 'User preferences saved successfully', data: userPreferences });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user preferences', error });
  }
});

// Get User Preferences
router.get('/preferences/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userPreferences = await UserPreferences.findOne({ userId });

    if (!userPreferences) {
      return res.status(404).json({ message: 'User preferences not found' });
    }

    res.status(200).json({ data: userPreferences });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user preferences', error });
  }
});

module.exports = router;
