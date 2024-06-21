const mongoose = require('mongoose');

const UserPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  preferredCuisines: { type: [String], default: [] },
  healthGoals: { 
    type: String, 
    enum: ['weight loss', 'muscle gain', 'maintenance', 'endurance', 'general health', 'cardiovascular health'], 
    default: 'maintenance' 
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
  fitnessLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  schemaVersion: { type: Number, default: 1 } // Schema versioning
});

module.exports = mongoose.model('UserPreferences', UserPreferencesSchema);
