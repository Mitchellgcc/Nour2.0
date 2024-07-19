const mongoose = require('mongoose');

const UserPreferencesSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  preferredCuisines: { type: [String], default: [] },
  healthGoals: { 
    type: [String], 
    enum: ['weight loss', 'muscle gain', 'maintenance', 'endurance', 'general health', 
           'cardiovascular health', 'improve heart health', 'increase muscle mass', 
           'reduce body fat', 'improve flexibility', 'increase stamina'], 
    default: ['maintenance'] 
  },
  dietaryRestrictions: { type: [String], default: [] },
  allergies: { type: [String], default: [] },
  macroTargets: {
    proteins: { type: Number, default: 0, min: 0, max: 500 },
    carbohydrates: { type: Number, default: 0, min: 0, max: 500 },
    fats: { type: Number, default: 0, min: 0, max: 200 }
  },
  mealFrequency: { type: Number, default: 3, min: 1, max: 10 },
  mealTimes: { type: [String], default: ['08:00', '12:00', '18:00'] },
  hydrationGoals: { type: Number, default: 2000, min: 500, max: 5000 },
  supplementPreferences: { type: [String], default: [] },
  preferredMealTypes: { 
    type: [String], 
    enum: ['breakfast', 'lunch', 'dinner', 'snack'], 
    default: ['breakfast', 'lunch', 'dinner'] 
  },
  preferredIngredients: { type: [String], default: [] },
  dislikedIngredients: { type: [String], default: [] },
  fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  preferredActivities: { type: [String], default: [] },
  mealtimePreferences: { type: String, enum: ['early', 'regular', 'late'], default: 'regular' },
  snackPreferences: { type: [String], default: [] },
  alcoholConsumption: { type: String, enum: ['none', 'occasional', 'moderate', 'regular'], default: 'occasional' },
  caffeineConsumption: { type: String, enum: ['none', 'low', 'moderate', 'high'], default: 'moderate' },
  sleepQuality: { type: String, enum: ['poor', 'average', 'good', 'excellent'], default: 'average' },
  stressLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  mood: { type: String, enum: ['happy', 'neutral', 'sad', 'anxious'], default: 'neutral' },
  bloodGlucoseLevels: { type: Number, default: 0, min: 0, max: 300 },
  geneticPredispositions: { type: [String], default: [] },
  wearableDevices: { type: [String], default: [] },
  notificationPreferences: { type: [String], default: [] },
  medicalConditions: { type: [String], default: [] },
  medications: { type: [String], default: [] },
  dynamicPreferences: { type: [String], default: [] },
  supplementIntake: {
    type: [String],
    default: []
  },
  detailedActivityLevel: {
    type: [String],
    default: []
  },
  schemaVersion: { type: Number, default: 1 }
});

module.exports = mongoose.model('UserPreferences', UserPreferencesSchema);
