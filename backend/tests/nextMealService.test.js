const { sequelize } = require('../config/database');
const User = require('../models/User');
const UserPreferences = require('../models/UserPreferences');
const NutritionalData = require('../models/NutritionalData');
const WhoopData = require('../models/WhoopData');
const EnhancedData = require('../models/EnhancedData');
const nextMealService = require('../services/nextMealService');
const mongoose = require('mongoose');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
require('dotenv').config();

jest.setTimeout(30000); // Increase Jest timeout to 30 seconds

let mock;

beforeAll(async () => {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Sync Sequelize models
    await sequelize.sync({ force: true });

    // Mock OpenAI API
    mock = new MockAdapter(axios);
    mock.onPost('https://api.openai.com/v1/chat/completions').reply(200, {
        choices: [{
            message: {
                content: JSON.stringify({
                    name: "Test Meal",
                    description: "This is a test meal.",
                    prepTime: "10 minutes",
                    reasons: ["Reason 1", "Reason 2"],
                    microsMacros: "Protein: 20g, Carbs: 50g, Fat: 10g",
                    ingredients: ["Ingredient 1", "Ingredient 2"],
                    instructions: ["Step 1", "Step 2"]
                })
            }
        }]
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await sequelize.close();
});

describe('Next Meal Service', () => {
    let user;

    beforeEach(async () => {
        // Create a test user and associated data
        user = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'password',
            dateOfBirth: new Date(1990, 1, 1),
            height: 180,
            weight: 75,
            gender: 'male',
            activityLevel: 'active'
        });

        await UserPreferences.create({
            userId: user.id,
            preferredCuisines: ['Italian', 'Mexican'],
            dietaryRestrictions: ['gluten'],
            allergies: ['peanuts'],
            healthGoals: ['weight loss']
        });

        await NutritionalData.create({
            userId: user.id,
            calories: 2000,
            protein: 150,
            fat: 70,
            carbs: 250,
            date: new Date()
        });

        await WhoopData.create({
            userId: user.id,
            sleepQuality: 'good',
            cycles: [{
                score: {
                    strain: 15
                }
            }]
        });

        await EnhancedData.create({
            userId: user.id,
            energyMetrics: {
                avgEnergyExpenditure: 3000
            }
        });
    });

    afterEach(async () => {
        // Clean up data
        await User.destroy({ where: {} });
        await UserPreferences.destroy({ where: {} });
        await NutritionalData.destroy({ where: {} });
        await WhoopData.destroy({ where: {} });
        await EnhancedData.destroy({ where: {} });
    });

    it('should fetch and display a new meal for the user', async () => {
        const meal = await nextMealService.fetchAndDisplayNewMeal(user.id);
        
        expect(meal).toHaveProperty('name', 'Test Meal');
        expect(meal).toHaveProperty('description', 'This is a test meal.');
        expect(meal).toHaveProperty('prepTime', '10 minutes');
        expect(meal).toHaveProperty('reasons');
        expect(meal.reasons).toContain('Reason 1');
        expect(meal.reasons).toContain('Reason 2');
        expect(meal).toHaveProperty('microsMacros', 'Protein: 20g, Carbs: 50g, Fat: 10g');
        expect(meal).toHaveProperty('ingredients');
        expect(meal.ingredients).toContain('Ingredient 1');
        expect(meal.ingredients).toContain('Ingredient 2');
        expect(meal).toHaveProperty('instructions');
        expect(meal.instructions).toContain('Step 1');
        expect(meal.instructions).toContain('Step 2');
    });
});
