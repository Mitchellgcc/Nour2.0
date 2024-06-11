const { getRecommendations } = require('../services/recommendationEngine');
const WhoopData = require('../models/WhoopData');
const Meal = require('../models/Meal');
const User = require('../models/User');

jest.mock('../models/WhoopData');
jest.mock('../models/Meal');
jest.mock('../models/User');

describe('Recommendation Engine', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should include glycemic impact in recommendations', async () => {
        const mockUser = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            dietaryPreferences: { vegetarian: true },
        };

        const mockWhoopData = {
            userId: mockUser.id,
            cycles: [
                { score: { average_heart_rate: 70, strain: 10, kilojoule: 500, resting_heart_rate: 60 } }
            ],
            recoveries: [
                { score: { hrv_rmssd_milli: 85, recovery_score: 90, muscle_soreness: 2, mental_fatigue: 1 } }
            ],
        };

        const mockMeals = [
            { id: 'meal1', name: 'Oatmeal', userId: mockUser.id, carbs: 30, micronutrients: { fiber: 4 } },
            { id: 'meal2', name: 'Apple', userId: mockUser.id, carbs: 20, micronutrients: { fiber: 3 } },
        ];

        User.findByPk.mockResolvedValue(mockUser);
        WhoopData.findOne.mockResolvedValue(mockWhoopData);
        Meal.findAll.mockResolvedValue(mockMeals);

        console.log('Mock Whoop Data:', mockWhoopData); // Add this line
        console.log('Mock Meals:', mockMeals); // Add this line

        const recommendations = await getRecommendations(mockUser.id);

        expect(recommendations).toHaveProperty('glycemicImpact');
        expect(recommendations.glycemicImpact).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: 'Oatmeal',
                    glycemicIndex: expect.any(Number),
                    glycemicLoad: expect.any(Number),
                }),
                expect.objectContaining({
                    name: 'Apple',
                    glycemicIndex: expect.any(Number),
                    glycemicLoad: expect.any(Number),
                }),
            ])
        );
    });
});
