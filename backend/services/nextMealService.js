const User = require('../models/User');
const UserPreferences = require('../models/UserPreferences');
const { NutritionalData } = require('../models/NutritionalData');
const WhoopData = require('../models/WhoopData');
const EnhancedData = require('../models/EnhancedData');
const axios = require('axios');
const logger = require('../config/logger');
const Meal = require('../models/Meal');
require('dotenv').config();

const openaiApiKey = process.env.OPENAI_API_KEY;

const aggregateUserData = async (userId) => {
    try {
        logger.info(`Aggregating data for user ${userId}`);
        const user = await User.findOne({ where: { id: userId } });
        logger.info('User data:', user);

        const userPreferences = await UserPreferences.findOne({ where: { userId } });
        logger.info('User preferences:', userPreferences);

        const nutritionalData = await NutritionalData.findAll({ where: { userId }, order: [['date', 'DESC']], limit: 1 });
        logger.info('Nutritional data:', nutritionalData);

        const whoopData = await WhoopData.findOne({ where: { userId } });
        logger.info('Whoop data:', whoopData);

        const enhancedData = await EnhancedData.findOne({ where: { userId } });
        logger.info('Enhanced data:', enhancedData);

        const aggregatedData = {
            user,
            userPreferences,
            nutritionalData: nutritionalData[0] || {},
            whoopData,
            enhancedData
        };

        logger.info('Aggregated user data:', aggregatedData);
        return aggregatedData;
    } catch (error) {
        logger.error('Error aggregating user data:', error);
        throw error;
    }
};

const getMealRecommendations = async (userData) => {
    try {
        logger.info('Generating GPT prompt...');
        const prompt = generatePrompt(userData);
        logger.info('GPT prompt generated:', prompt);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo-instruct",
            messages: [{ role: "system", content: "You are a meal planning assistant." }, { role: "user", content: prompt }],
            max_tokens: 500,
            temperature: 0.7
        }, {
            headers: {
                Authorization: `Bearer ${openaiApiKey}`
            }
        });

        const mealRecommendations = JSON.parse(response.data.choices[0].message.content);
        logger.info('Meal recommendations received:', mealRecommendations);
        return mealRecommendations;
    } catch (error) {
        logger.error('Error getting meal recommendations:', error);
        throw error;
    }
};

const generatePrompt = (userData) => {
    const {
        user = {},
        userPreferences = {},
        nutritionalData = {},
        whoopData = {},
        enhancedData = {}
    } = userData;

    const userInfo = `
        Name: ${user.name || 'Unknown'}
        Age: ${user.age || 'Unknown'}
        Gender: ${user.gender || 'Unknown'}
        Weight: ${user.weight || 'Unknown'}
        Height: ${user.height || 'Unknown'}
    `;

    const preferencesInfo = `
        Preferred Cuisines: ${userPreferences.preferredCuisines ? userPreferences.preferredCuisines.join(', ') : 'None'}
        Dietary Restrictions: ${userPreferences.dietaryRestrictions ? userPreferences.dietaryRestrictions.join(', ') : 'None'}
        Allergies: ${userPreferences.allergies ? userPreferences.allergies.join(', ') : 'None'}
        Health Goals: ${userPreferences.healthGoals ? userPreferences.healthGoals.join(', ') : 'None'}
    `;

    const nutritionalInfo = `
        Current Caloric Intake: ${nutritionalData.calories || 'Unknown'} kcal
        Macronutrients: 
            Protein: ${nutritionalData.protein || 'Unknown'}g
            Fat: ${nutritionalData.fat || 'Unknown'}g
            Carbs: ${nutritionalData.carbs || 'Unknown'}g
    `;

    const whoopInfo = whoopData ? `
        Whoop Data:
            Sleep Quality: ${whoopData.sleepQuality || 'Unknown'}
            Strain: ${whoopData.cycles ? whoopData.cycles[0]?.score?.strain || 'Unknown' : 'Unknown'}
    ` : '';

    const enhancedInfo = enhancedData ? `
        Enhanced Data:
            Energy Expenditure: ${enhancedData.energyMetrics ? enhancedData.energyMetrics.avgEnergyExpenditure || 'Unknown' : 'Unknown'}
    ` : '';

    return `Given the user's profile with the following details: 
        ${userInfo}
        ${preferencesInfo}
        ${nutritionalInfo}
        ${whoopInfo}
        ${enhancedInfo}
        considering their current caloric balance, health goals, recovery needs, activity level, and sleep quality, generate a detailed meal recommendation. 
        The recommendation should consider the user's comprehensive profile, including health conditions, allergies, medications, lifestyle, and dietary preferences.
        
        Include reasons why this meal is suitable, providing a brief description, prep time, and key micros/macros. 
        Format the response in structured JSON with keys for the meal's name, description, prepTime, reasons, microsMacros, ingredients, and instructions:
        {
            "name": "<Meal Name>",
            "description": "<Meal Description>",
            "prepTime": "<Preparation Time>",
            "reasons": ["<Reason 1>", "<Reason 2>", "..."],
            "microsMacros": "<Key Nutritional Information>",
            "ingredients": ["<Ingredient 1>", "<Ingredient 2>", "..."],
            "instructions": ["<Step 1>", "<Step 2>", "..."]
        }`;
};

const fetchAndDisplayNewMeal = async (userId) => {
    try {
        logger.info(`Fetching new meal for user ${userId}`);
        const userData = await aggregateUserData(userId);
        logger.info(`User data aggregated for user ${userId}:`, userData);

        const mealRecommendations = await getMealRecommendations(userData);
        logger.info(`Meal recommendations for user ${userId}:`, mealRecommendations);

        if (!mealRecommendations || mealRecommendations.length === 0) {
            throw new Error('No meal recommendations available');
        }

        const meal = mealRecommendations[0]; // Simplified for illustration
        logger.info(`Returning meal for user ${userId}:`, meal);
        return meal;
    } catch (error) {
        logger.error(`Error fetching and displaying new meal for user ${userId}:`, error);
        throw error;
    }
};

const saveNextMealData = (meal) => {
    logger.info('Saving next meal data to local storage:', meal);
    saveToLocalStorage('nextMeal', meal);
};

const saveToLocalStorage = (key, value) => {
    if (typeof localStorage !== 'undefined') {
        const timestampedValue = {
            data: value,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(timestampedValue));
        logger.info(`Data saved to local storage under key: ${key}`);
    }
};

const loadNextMealData = () => {
    logger.info('Loading next meal data from local storage');
    return loadFromLocalStorage('nextMeal');
};

const loadFromLocalStorage = (key) => {
    if (typeof localStorage !== 'undefined') {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            const parsedValue = JSON.parse(storedValue);
            const currentTime = Date.now();
            const maxAge = 86400000;
            if ((currentTime - parsedValue.timestamp) < maxAge) {
                logger.info(`Data loaded from local storage under key: ${key}`, parsedValue.data);
                return parsedValue.data;
            }
        }
    }
    return null;
};

const swipeMeal = async (direction, userId) => {
    try {
        logger.info(`Swiping meal in direction: ${direction} for user ID: ${userId}`);
        if (direction === 'next') {
            return await fetchAndDisplayNewMeal(userId);
        } else {
            const meals = loadNextMealData();
            return meals[0];
        }
    } catch (error) {
        logger.error('Error swiping meal:', error);
        throw error;
    }
};

const markMealAsFavorite = async (userId, mealId) => {
    try {
        logger.info(`Marking meal ${mealId} as favorite for user ${userId}`);
        const result = await Meal.updateOne(
            { _id: mealId, userId: userId },
            { $set: { favorite: true } }
        );
        logger.info('Meal marked as favorite:', result);
        return result;
    } catch (error) {
        logger.error('Error marking meal as favorite:', error);
        throw error;
    }
};

const submitFeedback = async (userId, mealId, rating, comments) => {
    try {
        logger.info(`Submitting feedback for meal ${mealId} by user ${userId}`);
        const feedback = {
            rating,
            comments,
            userId,
            mealId,
            date: new Date()
        };
        const result = await Feedback.create(feedback);
        logger.info('Feedback submitted:', result);
        return result;
    } catch (error) {
        logger.error('Error submitting feedback:', error);
        throw error;
    }
};

const adjustMealPlan = async (userId, healthData) => {
    try {
        logger.info(`Adjusting meal plan for user ${userId} with health data ${JSON.stringify(healthData)}`);
        const result = await Meal.updateMany(
            { userId: userId },
            { $set: { healthData } }
        );
        logger.info('Meal plan adjusted:', result);
        return result;
    } catch (error) {
        logger.error('Error adjusting meal plan:', error);
        throw error;
    }
};

const fetchMealById = async (id) => {
    try {
        const meal = await Meal.findById(id);
        return meal;
    } catch (error) {
        throw new Error('Error fetching meal by ID');
    }
};

module.exports = {
    fetchAndDisplayNewMeal,
    swipeMeal,
    markMealAsFavorite,
    submitFeedback,
    getMealRecommendations,
    adjustMealPlan,
    aggregateUserData,
    fetchMealById // Ensure this is correctly exported
};
