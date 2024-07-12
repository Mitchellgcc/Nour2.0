// backend/services/DataAggregationService.js

const axios = require('axios');
const Meal = require('../models/Meal');
const NutritionalData = require('../models/NutritionalData');
const WhoopData = require('../models/WhoopData');
const EnhancedData = require('../models/EnhancedData');
require('dotenv').config();

const fetchTemperatureData = async (location) => {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
        throw new Error('Weather API key is missing');
    }
    
    try {
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
        return response.data.current.temp_c;
    } catch (error) {
        console.error('Error fetching temperature data:', error);
        throw error;
    }
};

const aggregateNutritionalData = async (userId) => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
        userId: userId,
        createdAt: { $gte: startDate, $lte: endDate }
    });

    console.log(`Found ${meals.length} meals for user ${userId}`);

    const aggregatedData = {
        totalCalories: 0,
        macronutrients: { proteins: 0, carbohydrates: 0, fats: 0 },
        micronutrients: {
            vitamins: new Map(),
            minerals: new Map()
        },
        hydrationLevel: 0,
        mealIds: []  // Include mealIds
    };

    meals.forEach(meal => {
        aggregatedData.totalCalories += meal.calories || 0;
        aggregatedData.macronutrients.proteins += meal.protein || 0;
        aggregatedData.macronutrients.carbohydrates += meal.carbs || 0;
        aggregatedData.macronutrients.fats += meal.fat || 0;

        aggregatedData.mealIds.push(meal._id); // Capture mealId

        if (meal.micronutrients && meal.micronutrients.vitamins) {
            meal.micronutrients.vitamins.forEach((value, key) => {
                if (!aggregatedData.micronutrients.vitamins.has(key)) {
                    aggregatedData.micronutrients.vitamins.set(key, 0);
                }
                aggregatedData.micronutrients.vitamins.set(key, aggregatedData.micronutrients.vitamins.get(key) + value || 0);
            });
        }

        if (meal.micronutrients && meal.micronutrients.minerals) {
            meal.micronutrients.minerals.forEach((value, key) => {
                if (!aggregatedData.micronutrients.minerals.has(key)) {
                    aggregatedData.micronutrients.minerals.set(key, 0);
                }
                aggregatedData.micronutrients.minerals.set(key, aggregatedData.micronutrients.minerals.get(key) + value || 0);
            });
        }
    });

    console.log('Aggregated Data:', aggregatedData);

    aggregatedData.hydrationLevel = meals.reduce((total, meal) => total + (meal.waterContent || 0), 0);

    // Convert the Map to a plain object before saving
    const vitaminsObj = {};
    aggregatedData.micronutrients.vitamins.forEach((value, key) => {
        vitaminsObj[key] = value;
    });

    const mineralsObj = {};
    aggregatedData.micronutrients.minerals.forEach((value, key) => {
        mineralsObj[key] = value;
    });

    return {
        userId,
        totalCalories: aggregatedData.totalCalories,
        macronutrients: aggregatedData.macronutrients,
        micronutrients: {
            vitamins: vitaminsObj,
            minerals: mineralsObj
        },
        hydrationLevel: aggregatedData.hydrationLevel,
        mealIds: aggregatedData.mealIds, // Include mealIds
        date: new Date()
    };
};


const saveOrUpdateNutritionalData = async (userId, nutritionalData) => {
    try {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        console.log('Nutritional Data to save or update:', nutritionalData);

        let existingData = await NutritionalData.findOne({ userId, date: { $gte: startDate, $lt: endDate } });

        if (existingData) {
            // Update existing document
            console.log('Updating existing nutritional data:', existingData);
            Object.assign(existingData, nutritionalData);
            await existingData.save();
            console.log('Updated nutritional data:', existingData);
        } else {
            // Create a new document
            const newData = new NutritionalData({ userId, ...nutritionalData });
            await newData.save();
            console.log('Created new nutritional data:', newData);
        }
    } catch (error) {
        console.error('Error saving or updating nutritional data:', error);
        throw error;
    }
};

const aggregateWhoopData = async (userId) => {
    try {
        const whoopData = await WhoopData.findOne({ userId });

        if (!whoopData) {
            throw new Error('No Whoop data found for user');
        }

        const aggregatedData = {
            strain: whoopData.cycles.reduce((total, cycle) => total + cycle.score.strain, 0) / whoopData.cycles.length,
            kilojoules: whoopData.cycles.reduce((total, cycle) => total + cycle.score.kilojoule, 0),
            averageHeartRate: whoopData.cycles.reduce((total, cycle) => total + cycle.score.average_heart_rate, 0) / whoopData.cycles.length,
            maxHeartRate: Math.max(...whoopData.cycles.map(cycle => cycle.score.max_heart_rate)),
            recovery: whoopData.recoveries.reduce((total, recovery) => total + recovery.score.recovery_score, 0) / whoopData.recoveries.length,
            restingHeartRate: whoopData.recoveries.reduce((total, recovery) => total + recovery.score.resting_heart_rate, 0) / whoopData.recoveries.length,
            hrv: whoopData.recoveries.reduce((total, recovery) => total + recovery.score.hrv_rmssd_milli, 0) / whoopData.recoveries.length,
            sleepPerformance: whoopData.sleepData.reduce((total, sleep) => total + sleep.score.sleep_performance_percentage, 0) / whoopData.sleepData.length,
            sleepEfficiency: whoopData.sleepData.reduce((total, sleep) => total + sleep.score.sleep_efficiency_percentage, 0) / whoopData.sleepData.length,
            sleepConsistency: whoopData.sleepData.reduce((total, sleep) => total + sleep.score.sleep_consistency_percentage, 0) / whoopData.sleepData.length
        };

        return aggregatedData;
    } catch (error) {
        console.error('Error aggregating Whoop data:', error);
        throw error;
    }
};

const aggregateEnhancedData = async (userId) => {
    try {
        const whoopData = await aggregateWhoopData(userId);
        const enhancedData = await EnhancedData.findOne({ userId });

        if (!enhancedData) {
            throw new Error('No Enhanced data found for user');
        }

        return {
            strainMetrics: enhancedData.strainMetrics,
            recoveryMetrics: enhancedData.recoveryMetrics,
            heartRateMetrics: enhancedData.heartRateMetrics,
            hrvMetrics: enhancedData.hrvMetrics,
            energyMetrics: enhancedData.energyMetrics,
            whoopData: whoopData
        };
    } catch (error) {
        console.error('Error aggregating enhanced data:', error);
        throw error;
    }
};

module.exports = {
    aggregateNutritionalData,
    saveOrUpdateNutritionalData,
    aggregateEnhancedData,
    fetchTemperatureData
};
