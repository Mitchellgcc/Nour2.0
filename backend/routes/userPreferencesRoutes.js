const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserPreferences');

// Create or Update User Preferences
router.post('/preferences', async (req, res) => {
  const { userId, preferredCuisines, healthGoals, dietaryRestrictions, allergies, mealPreferences, favoriteFoods, dislikedFoods } = req.body;

  try {
    let userPreferences = await UserPreferences.findOne({ userId });
    
    if (userPreferences) {
      // Update existing preferences
      userPreferences.preferredCuisines = preferredCuisines || userPreferences.preferredCuisines;
      userPreferences.healthGoals = healthGoals || userPreferences.healthGoals;
      userPreferences.dietaryRestrictions = dietaryRestrictions || userPreferences.dietaryRestrictions;
      userPreferences.allergies = allergies || userPreferences.allergies;
      userPreferences.mealPreferences = mealPreferences || userPreferences.mealPreferences;
      userPreferences.favoriteFoods = favoriteFoods || userPreferences.favoriteFoods;
      userPreferences.dislikedFoods = dislikedFoods || userPreferences.dislikedFoods;
    } else {
      // Create new preferences
      userPreferences = new UserPreferences({
        userId,
        preferredCuisines,
        healthGoals,
        dietaryRestrictions,
        allergies,
        mealPreferences,
        favoriteFoods,
        dislikedFoods
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
