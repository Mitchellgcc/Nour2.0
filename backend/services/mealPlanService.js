const Meal = require('../models/Meal');
const UserPreferences = require('../models/UserPreferences');
const WhoopData = require('../models/WhoopData');
const UserFeedback = require('../models/UserFeedback');

// Adjust meals based on user's health goals
function adjustMealsForHealthGoals(meals, healthGoal) {
    return meals.map(meal => {
        if (healthGoal === 'weight loss') {
            meal.calories = Math.round(meal.calories * 0.8);
            meal.proteins = Math.round(meal.proteins * 1.1);
            meal.carbohydrates = Math.round(meal.carbohydrates * 0.9);
            meal.fats = Math.round(meal.fats * 0.8);
        } else if (healthGoal === 'muscle gain') {
            meal.calories = Math.round(meal.calories * 1.2);
            meal.proteins = Math.round(meal.proteins * 1.3);
            meal.carbohydrates = Math.round(meal.carbohydrates * 1.2);
            meal.fats = Math.round(meal.fats * 1.1);
        }
        const totalMacros = meal.proteins + meal.carbohydrates + meal.fats;
        meal.proteins = Math.round((meal.proteins / totalMacros) * 100);
        meal.carbohydrates = Math.round((meal.carbohydrates / totalMacros) * 100);
        meal.fats = Math.round((meal.fats / totalMacros) * 100);

        return meal;
    });
}

// Adjust meals based on user's macronutrient targets
function adjustPortionSizes(meals, macroTargets) {
    return meals.map(meal => {
        if (macroTargets.proteins > 0) meal.proteins = macroTargets.proteins;
        if (macroTargets.carbohydrates > 0) meal.carbohydrates = macroTargets.carbohydrates;
        if (macroTargets.fats > 0) meal.fats = macroTargets.fats;
        return meal;
    });
}

// Adjust meals based on real-time health data
function adjustMealsForRealTimeData(meals, whoopData) {
    const { average_heart_rate, kilojoule } = whoopData.cycles.slice(-1)[0].score;

    return meals.map(meal => {
        meal.calories += kilojoule / 4.184; // Convert kilojoules to calories
        if (average_heart_rate > 100) {
            meal.carbohydrates += 20; // Increase carbs for high activity levels
        }
        if (whoopData.sleep_performance < 50) {
            meal.proteins += 10; // Increase protein for better recovery
        }
        return meal;
    });
}

// Filter and adjust meals based on user preferences
function filterAndAdjustMeals(meals, userPreferences) {
    return meals.filter(meal => {
        const matchesCuisine = userPreferences.preferredCuisines.includes(meal.cuisine);
        const isDietaryCompliant = !userPreferences.dietaryRestrictions.some(restriction => meal.restrictions.includes(restriction));
        const isAllergySafe = !userPreferences.allergies.some(allergy => meal.ingredients.includes(allergy));
        return matchesCuisine && isDietaryCompliant && isAllergySafe;
    }).map(meal => {
        meal.proteins = Math.round(meal.proteins * (userPreferences.macroTargets.proteins / meal.proteins));
        meal.carbohydrates = Math.round(meal.carbohydrates * (userPreferences.macroTargets.carbohydrates / meal.carbohydrates));
        meal.fats = Math.round(meal.fats * (userPreferences.macroTargets.fats / meal.fats));
        return meal;
    });
}

// Generate meal plan for a user
async function generateMealPlan(userId) {
    try {
        const userPreferences = await UserPreferences.findOne({ userId });
        if (!userPreferences) {
            throw new Error('User preferences not found');
        }

        const mealOptions = await Meal.findAll();
        let finalMeals = filterAndAdjustMeals(mealOptions, userPreferences);

        const whoopData = await WhoopData.findOne({ userId });
        if (whoopData) {
            finalMeals = adjustMealsForRealTimeData(finalMeals, whoopData);
        }

        // New: Include hydration goals and preferred meal types in the plan
        const hydrationGoal = userPreferences.hydrationGoals || 2000; // Default to 2000ml
        const supplementPreferences = userPreferences.supplementPreferences || [];

        finalMeals.forEach(meal => {
            meal.hydrationRecommendation = hydrationGoal / finalMeals.length;
            meal.supplements = supplementPreferences; // Include supplements
        });

        return {
            meals: finalMeals,
            mealFrequency: userPreferences.mealFrequency,
            mealTimes: userPreferences.mealTimes,
            hydrationGoal,
            supplementPreferences
        };
    } catch (error) {
        console.error('Error generating meal plan:', error);
        throw error;
    }
}

// Collect and store user feedback on meals
async function collectUserFeedback(userId, mealId, feedback) {
    try {
        const userFeedback = new UserFeedback({
            userId,
            mealId,
            rating: feedback.rating,
            comments: feedback.comments || '',
            detailedFeedback: feedback.detailedFeedback || '' // New field for more detailed feedback
        });
        await userFeedback.save();
        return userFeedback;
    } catch (error) {
        console.error('Error collecting user feedback:', error);
        throw error;
    }
}

// Adjust meals based on collected user feedback
async function adjustMealsBasedOnFeedback(meals, userId) {
    const feedbacks = await UserFeedback.find({ userId });

    return meals.map(meal => {
        const feedbackForMeal = feedbacks.find(fb => fb.mealId.toString() === meal.id.toString());

        if (feedbackForMeal) {
            // Example adjustments based on feedback
            if (feedbackForMeal.rating < 3) {
                meal.calories *= 0.9; // Reduce calories if rating is low
                meal.carbohydrates *= 0.8; // Reduce carbs if dissatisfaction
            }
            // Further specific adjustments can be added here based on feedback content
        }

        return meal;
    });
}

module.exports = {
    generateMealPlan,
    collectUserFeedback,
    adjustMealsBasedOnFeedback
};
