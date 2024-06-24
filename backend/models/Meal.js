// backend/models/Meal.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Meal = sequelize.define('Meal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  calories: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  protein: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  carbs: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  micronutrients: { type: DataTypes.JSON, allowNull: true },
  vitamins: { type: DataTypes.JSON, allowNull: true }, // e.g., { A: 500, C: 30 }
  minerals: { type: DataTypes.JSON, allowNull: true }, // e.g., { calcium: 200, iron: 15 }
  glycemicIndex: { type: DataTypes.FLOAT, allowNull: true },
  glycemicLoad: { type: DataTypes.FLOAT, allowNull: true },
  waterContent: { type: DataTypes.FLOAT, allowNull: true },
  omega3: { type: DataTypes.FLOAT, allowNull: true },
  omega6: { type: DataTypes.FLOAT, allowNull: true },
  polyphenols: { type: DataTypes.FLOAT, allowNull: true },
  antioxidants: { type: DataTypes.FLOAT, allowNull: true },
  solubleFiber: { type: DataTypes.FLOAT, allowNull: true },
  insolubleFiber: { type: DataTypes.FLOAT, allowNull: true },
  sodium: { type: DataTypes.FLOAT, allowNull: true },
  cholesterol: { type: DataTypes.FLOAT, allowNull: true },
  fiber: { type: DataTypes.FLOAT, allowNull: true },
  sugar: { type: DataTypes.FLOAT, allowNull: true },
  aminoAcids: { 
    type: DataTypes.JSON, 
    allowNull: true 
  }, // e.g., { leucine: 2.5, lysine: 1.8 }
  fattyAcids: { 
    type: DataTypes.JSON, 
    allowNull: true 
  }, // e.g., { saturated: 10, unsaturated: 20 }
  nutrientDensityScore: { type: DataTypes.FLOAT, allowNull: true },
  healthImpactScore: { type: DataTypes.FLOAT, allowNull: true },
  inflammationScore: { type: DataTypes.FLOAT, allowNull: true },
  oxidativeStressScore: { type: DataTypes.FLOAT, allowNull: true },
  microbiomeImpactScore: { type: DataTypes.FLOAT, allowNull: true },
  allergens: { 
    type: [String], 
    allowNull: true 
  }, // e.g., ['nuts', 'soy']
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Meal;
