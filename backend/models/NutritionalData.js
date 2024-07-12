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
    vitamins: { type: Map, of: Number, required: true },
    minerals: { type: Map, of: Number, required: true }
  },
  hydrationLevel: { type: Number, required: true },
  mealIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true }], // Include mealIds
  date: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

const NutritionalData = mongoose.model('NutritionalData', nutritionalDataSchema);

module.exports = NutritionalData;
