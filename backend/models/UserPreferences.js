const mongoose = require('mongoose');

const UserPreferencesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    preferredCuisines: { type: [String], default: [] },
    healthGoals: { type: String, enum: ['weight loss', 'muscle gain', 'maintenance'], default: 'maintenance' },
    dietaryRestrictions: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    macroTargets: {
        proteins: { type: Number, default: 0 },
        carbohydrates: { type: Number, default: 0 },
        fats: { type: Number, default: 0 }
    },
    mealFrequency: { type: Number, default: 3 },
    mealTimes: { type: [String], default: ['08:00', '12:00', '18:00'] }
});

module.exports = mongoose.model('UserPreferences', UserPreferencesSchema);
