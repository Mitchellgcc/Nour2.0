// backend/models/NutritionalData.js

const mongoose = require('mongoose');

const nutritionalDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  totalCalories: { type: Number, required: true },
  macronutrients: {
    proteins: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    fats: { type: Number, required: true }
  },
  micronutrients: {
    vitamins: { type: Map, of: Number, required: true, default: {} },
    minerals: { type: Map, of: Number, required: true, default: {} }
  },
  hydrationLevel: { type: Number, required: true },
  mealIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true }],
  date: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

const NutritionalData = mongoose.model('NutritionalData', nutritionalDataSchema);

module.exports = NutritionalData;
