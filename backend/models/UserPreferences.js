// backend/models/UserPreferences.js
const mongoose = require('mongoose');

const UserPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  preferredCuisines: { type: [String], default: [] },
  healthGoals: { 
    type: [String], 
    enum: ['weight loss', 'muscle gain', 'maintenance', 'endurance', 'general health', 
           'cardiovascular health', 'improve heart health', 'increase muscle mass', 
           'reduce body fat', 'improve flexibility', 'increase stamina'], 
    default: ['maintenance'] 
  },
  dietaryRestrictions: { type: [String], default: [] }, // e.g., 'gluten-free', 'lactose-free'
  allergies: { type: [String], default: [] }, // e.g., 'peanuts', 'shellfish'
  macroTargets: {
    proteins: { type: Number, default: 0, min: 0, max: 500 }, // Protein intake in grams
    carbohydrates: { type: Number, default: 0, min: 0, max: 500 }, // Carb intake in grams
    fats: { type: Number, default: 0, min: 0, max: 200 } // Fat intake in grams
  },
  mealFrequency: { type: Number, default: 3, min: 1, max: 10 }, // Number of meals per day
  mealTimes: { type: [String], default: ['08:00', '12:00', '18:00'] }, // Mealtime in 24-hour format
  hydrationGoals: { type: Number, default: 2000, min: 500, max: 5000 }, // Hydration goals in milliliters
  supplementPreferences: { type: [String], default: [] }, // e.g., 'vitamin D', 'omega-3'
  preferredMealTypes: { 
    type: [String], 
    enum: ['breakfast', 'lunch', 'dinner', 'snack'], 
    default: ['breakfast', 'lunch', 'dinner'] 
  },
  preferredIngredients: { type: [String], default: [] }, // e.g., 'chicken', 'broccoli'
  dislikedIngredients: { type: [String], default: [] }, // e.g., 'brussels sprouts', 'liver'
  fitnessLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  preferredActivities: { type: [String], default: [] }, // e.g., 'running', 'cycling'
  mealtimePreferences: { 
    type: String, 
    enum: ['early', 'regular', 'late'], 
    default: 'regular' 
  },
  snackPreferences: { type: [String], default: [] }, // e.g., 'fruit', 'nuts', 'yogurt'
  alcoholConsumption: { 
    type: String, 
    enum: ['none', 'occasional', 'moderate', 'regular'], 
    default: 'occasional' 
  },
  caffeineConsumption: { 
    type: String, 
    enum: ['none', 'low', 'moderate', 'high'], 
    default: 'moderate' 
  },
  sleepQuality: { 
    type: String, 
    enum: ['poor', 'average', 'good', 'excellent'], 
    default: 'average' 
  },
  stressLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  mood: { 
    type: String, 
    enum: ['happy', 'neutral', 'sad', 'anxious'], 
    default: 'neutral' 
  },
  bloodGlucoseLevels: { type: Number, default: 0, min: 0, max: 300 }, // New field for tracking blood glucose
  geneticPredispositions: { type: [String], default: [] }, // New field for genetic predispositions
  wearableDevices: { type: [String], default: [] }, // New field for tracking wearable devices
  schemaVersion: { type: Number, default: 1 } // Schema versioning for future updates
});

module.exports = mongoose.model('UserPreferences', UserPreferencesSchema);
