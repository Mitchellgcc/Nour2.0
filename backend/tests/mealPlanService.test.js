const { generateMealPlan, adjustMealsBasedOnFeedback } = require('../services/mealPlanService');
const UserFeedback = require('../models/UserFeedback');

jest.mock('../models/UserFeedback');

test('should adjust meals based on user feedback', async () => {
    // Mock data
    const meals = [
        { _id: '1', calories: 500, carbohydrates: 60 },
        { _id: '2', calories: 600, carbohydrates: 70 }
    ];
    const feedbacks = [
        { mealId: '1', rating: 2, comments: 'Too many calories' },
        { mealId: '2', rating: 4, comments: 'Just right' }
    ];
    UserFeedback.find.mockResolvedValue(feedbacks);

    const adjustedMeals = await adjustMealsBasedOnFeedback(meals, 'testUserId');
    expect(adjustedMeals[0].calories).toBeLessThan(500);
    expect(adjustedMeals[1].calories).toBe(600); // No change
});
