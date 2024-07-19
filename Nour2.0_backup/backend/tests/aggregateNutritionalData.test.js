// backend/tests/aggregateNutritionalData.test.js

const mongoose = require('mongoose');
const NutritionalData = require('../models/NutritionalData');
const Meal = require('../models/Meal');
const { aggregateNutritionalData } = require('../services/DataAggregationService');

describe('DataAggregationService', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');
  }, 60000); // Increased timeout to 60 seconds

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await NutritionalData.deleteMany({});
    await Meal.deleteMany({});
  });

  it('should aggregate nutritional data correctly', async () => {
    const testMeals = [
      {
        userId: 'testUser',
        calories: 400,
        protein: 20,
        carbs: 50,
        fat: 15,
        micronutrients: {
          vitamins: { A: 200, C: 15 },
          minerals: { calcium: 100, iron: 8 },
        },
        waterContent: 200,
        _id: mongoose.Types.ObjectId(),
      },
      {
        userId: 'testUser',
        calories: 300,
        protein: 25,
        carbs: 40,
        fat: 10,
        micronutrients: {
          vitamins: { A: 150, C: 10 },
          minerals: { calcium: 80, iron: 6 },
        },
        waterContent: 150,
        _id: mongoose.Types.ObjectId(),
      },
    ];

    await Meal.insertMany(testMeals);

    const aggregatedData = await aggregateNutritionalData('testUser');

    expect(aggregatedData.totalCalories).toBe(700);
    expect(aggregatedData.macronutrients.proteins).toBe(45);
    expect(aggregatedData.macronutrients.carbohydrates).toBe(90);
    expect(aggregatedData.macronutrients.fats).toBe(25);
    expect(aggregatedData.micronutrients.vitamins.A).toBe(350);
    expect(aggregatedData.micronutrients.vitamins.C).toBe(25);
    expect(aggregatedData.micronutrients.minerals.calcium).toBe(180);
    expect(aggregatedData.micronutrients.minerals.iron).toBe(14);
    expect(aggregatedData.hydrationLevel).toBe(350);
  });
});