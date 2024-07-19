require('dotenv').config();
const mongoose = require('mongoose');
const UserPreferences = require('./models/UserPreferences');
const User = require('./models/User'); // Assuming the User model is in the same directory

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const populateUserPreferences = async () => {
  try {
    const testUserId = 'abc42412-0b4c-4e8c-ba7a-3d41c4a96ad1'; // Replace with the actual test user ID
    let userPreferences = await UserPreferences.findOne({ userId: testUserId });

    const newPreferences = {
      userId: testUserId,
      preferredCuisines: ['Italian', 'Mexican'],
      healthGoals: ['muscle gain'],
      dietaryRestrictions: ['none'],
      allergies: ['peanuts'],
      macroTargets: {
        proteins: 100,
        carbohydrates: 200,
        fats: 50
      },
      mealFrequency: 4,
      mealTimes: ['06:30', '10:30', '12:30', '17:00'],
      hydrationGoals: 2500,
      supplementPreferences: ['vitamin D', 'omega 3'],
      preferredMealTypes: ['breakfast', 'dinner'],
      preferredIngredients: ['tomato', 'avocado'],
      dislikedIngredients: ['broccoli'],
      fitnessLevel: 'intermediate',
      preferredActivities: ['running', 'cycling'],
      mealtimePreferences: 'early',
      snackPreferences: ['nuts', 'fruit'],
      alcoholConsumption: 'medium',
      caffeineConsumption: 'high',
      sleepQuality: 'bad',
      stressLevel: 'medium',
      mood: 'happy',
      bloodGlucoseLevels: 90,
      geneticPredispositions: ['diabetes', 'cholesterol'],
      wearableDevices: ['whoop'],
      notificationPreferences: ['email'],
      medicalConditions: ['none'],
      medications: ['trazadone'],
      dynamicPreferences: ['flexible diet'],
      supplementIntake: ['protein shake'],
      detailedActivityLevel: ['high'],
      schemaVersion: 1
    };

    if (!userPreferences) {
      userPreferences = new UserPreferences(newPreferences);
      await userPreferences.save();
      console.log('User preferences populated successfully');
    } else {
      await UserPreferences.updateOne({ userId: testUserId }, newPreferences);
      console.log('User preferences updated successfully');
    }
  } catch (error) {
    console.error('Error populating user preferences:', error);
  } finally {
    mongoose.connection.close();
  }
};

populateUserPreferences();
