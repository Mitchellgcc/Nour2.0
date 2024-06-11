const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js
const Meal = require('../models/Meal');

jest.mock('../models/Meal');

describe('Meal Logging', () => {
    it('should log a meal with micronutrients', async () => {
        const mockMeal = {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Salad',
            calories: 200,
            protein: 5,
            carbs: 20,
            fat: 10,
            micronutrients: {
                vitaminC: 30,
                iron: 2,
            },
        };

        Meal.create.mockResolvedValue(mockMeal);

        const response = await request(app)
            .post('/api/meals/log')
            .send(mockMeal)
            .expect(201);

        expect(response.body).toMatchObject(mockMeal);
        expect(Meal.create).toHaveBeenCalledWith(mockMeal);
    });
});