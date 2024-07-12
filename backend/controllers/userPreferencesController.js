const UserPreferences = require('../models/UserPreferences');
const { validationResult } = require('express-validator');

// Get user preferences
const getUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id; // Use req.user.id, assuming authMiddleware sets it correctly
    const preferences = await UserPreferences.findOne({ userId });

    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found' });
    }

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Update user preferences
const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = await UserPreferences.findOneAndUpdate(
      { userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Create or Update User Preferences
const createOrUpdateUserPreferences = async (req, res) => {
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
    dislikedIngredients,
    fitnessLevel,
    preferredActivities,
    mealtimePreferences,
    snackPreferences,
    alcoholConsumption,
    caffeineConsumption,
    sleepQuality,
    stressLevel
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
      userPreferences.dislikedIngredients = dislikedIngredients || userPreferences.dislikedIngredients;
      userPreferences.fitnessLevel = fitnessLevel || userPreferences.fitnessLevel;
      userPreferences.preferredActivities = preferredActivities || userPreferences.preferredActivities;
      userPreferences.mealtimePreferences = mealtimePreferences || userPreferences.mealtimePreferences;
      userPreferences.snackPreferences = snackPreferences || userPreferences.snackPreferences;
      userPreferences.alcoholConsumption = alcoholConsumption || userPreferences.alcoholConsumption;
      userPreferences.caffeineConsumption = caffeineConsumption || userPreferences.caffeineConsumption;
      userPreferences.sleepQuality = sleepQuality || userPreferences.sleepQuality;
      userPreferences.stressLevel = stressLevel || userPreferences.stressLevel;
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
        dislikedIngredients,
        fitnessLevel,
        preferredActivities,
        mealtimePreferences,
        snackPreferences,
        alcoholConsumption,
        caffeineConsumption,
        sleepQuality,
        stressLevel
      });
    }

    await userPreferences.save();
    res.status(200).json({ message: 'User preferences saved successfully', data: userPreferences });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user preferences', error });
  }
};

// Delete user preferences
const deleteUserPreferences = async (req, res) => {
  const { userId } = req.params;

  try {
    await UserPreferences.findOneAndDelete({ userId });
    res.status(200).json({ message: 'User preferences deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user preferences', error });
  }
};

module.exports = {
  getUserPreferences,
  updateUserPreferences,
  createOrUpdateUserPreferences,
  deleteUserPreferences
};
