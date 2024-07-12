// backend/models/Meal.js

const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
    primaryKey: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  micronutrients: {
    vitamins: { type: Map, of: Number, required: false },
    minerals: { type: Map, of: Number, required: false }
  },
  glycemicIndex: { type: Number, required: false },
  glycemicLoad: { type: Number, required: false },
  waterContent: { type: Number, required: false },
  omega3: { type: Number, required: false },
  omega6: { type: Number, required: false },
  polyphenols: { type: Number, required: false },
  antioxidants: { type: Number, required: false },
  solubleFiber: { type: Number, required: false },
  insolubleFiber: { type: Number, required: false },
  sodium: { type: Number, required: false },
  cholesterol: { type: Number, required: false },
  fiber: { type: Number, required: false },
  sugar: { type: Number, required: false },
  aminoAcids: { type: Map, of: Number, required: false },
  fattyAcids: { type: Map, of: Number, required: false },
  nutrientDensityScore: { type: Number, required: false },
  healthImpactScore: { type: Number, required: false },
  inflammationScore: { type: Number, required: false },
  oxidativeStressScore: { type: Number, required: false },
  microbiomeImpactScore: { type: Number, required: false },
  allergens: { type: [String], required: false },
  userId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
