const axios = require('axios');
const Meal = require('../models/Meal');
const NutritionalData = require('../models/NutritionalData');
const WhoopData = require('../models/WhoopData');
const EnhancedData = require('../models/EnhancedData');
require('dotenv').config();

// Function to sanitize map data
function sanitizeMapData(data) {
    const sanitizedData = {};
    for (const key in data) {
        if (data.hasOwnProperty(key) && !key.startsWith('$')) {
            sanitizedData[key] = data[key];
        }
    }
    return sanitizedData;
}

const fetchTemperatureData = async (location) => {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
        throw new Error('Weather API key is missing');
    }

    try {
        console.log(`Fetching temperature data for location: ${location}`);
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
        console.log(`Temperature data fetched successfully for location: ${location}`);
        return response.data.current.temp_c;
    } catch (error) {
        console.error('Error fetching temperature data:', error);
        throw error;
    }
};

// Function to clean micronutrient data
const cleanMicronutrients = (micronutrients) => {
    const allowedMicronutrients = ['vitamins', 'minerals'];

    const cleanedMicronutrients = {
        vitamins: new Map(),
        minerals: new Map()
    };

    for (const key of allowedMicronutrients) {
        if (micronutrients[key]) {
            const sanitizedData = sanitizeMapData(micronutrients[key]);
            for (const [subKey, subValue] of Object.entries(sanitizedData)) {
                cleanedMicronutrients[key].set(subKey, subValue);
            }
        }
    }

    return cleanedMicronutrients;
};

const aggregateNutritionalData = async (userId) => {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    console.log(`Aggregating nutritional data for user: ${userId} between ${startDate} and ${endDate}`);
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
        mealIds: []
    };

    meals.forEach(meal => {
        aggregatedData.totalCalories += meal.calories || 0;
        aggregatedData.macronutrients.proteins += meal.protein || 0;
        aggregatedData.macronutrients.carbohydrates += meal.carbs || 0;
        aggregatedData.macronutrients.fats += meal.fat || 0;

        aggregatedData.mealIds.push(meal._id);

        if (meal.micronutrients && meal.micronutrients.vitamins) {
            const sanitizedVitamins = sanitizeMapData(meal.micronutrients.vitamins);
            Object.entries(sanitizedVitamins).forEach(([key, value]) => {
                if (!aggregatedData.micronutrients.vitamins.has(key)) {
                    aggregatedData.micronutrients.vitamins.set(key, 0);
                }
                aggregatedData.micronutrients.vitamins.set(key, aggregatedData.micronutrients.vitamins.get(key) + value);
            });
        }

        if (meal.micronutrients && meal.micronutrients.minerals) {
            const sanitizedMinerals = sanitizeMapData(meal.micronutrients.minerals);
            Object.entries(sanitizedMinerals).forEach(([key, value]) => {
                if (!aggregatedData.micronutrients.minerals.has(key)) {
                    aggregatedData.micronutrients.minerals.set(key, 0);
                }
                aggregatedData.micronutrients.minerals.set(key, aggregatedData.micronutrients.minerals.get(key) + value);
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

    const finalData = {
        userId,
        totalCalories: aggregatedData.totalCalories,
        macronutrients: aggregatedData.macronutrients,
        micronutrients: {
            vitamins: vitaminsObj,
            minerals: mineralsObj
        },
        hydrationLevel: aggregatedData.hydrationLevel,
        mealIds: aggregatedData.mealIds,
        date: new Date()
    };

    console.log('Final Aggregated Nutritional Data:', finalData);
    return finalData;
};

const saveOrUpdateNutritionalData = async (userId, nutritionalData) => {
    try {
        // Sanitize the micronutrients data
        if (nutritionalData.micronutrients) {
            if (nutritionalData.micronutrients.vitamins) {
                nutritionalData.micronutrients.vitamins = sanitizeMapData(nutritionalData.micronutrients.vitamins);
            }
            if (nutritionalData.micronutrients.minerals) {
                nutritionalData.micronutrients.minerals = sanitizeMapData(nutritionalData.micronutrients.minerals);
            }

            // Clean the micronutrients data
            nutritionalData.micronutrients = cleanMicronutrients(nutritionalData.micronutrients);
        }

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
    console.log(`Aggregating Whoop data for user: ${userId}`);
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

    console.log('Aggregated Whoop Data:', aggregatedData);
    return aggregatedData;
  } catch (error) {
    console.error('Error aggregating Whoop data:', error);
    throw error;
  }
};

const aggregateEnhancedData = async (userId) => {
  try {
    console.log(`Aggregating Enhanced data for user: ${userId}`);
    const whoopData = await aggregateWhoopData(userId);
    const enhancedData = await EnhancedData.findOne({ userId });

    if (!enhancedData) {
      throw new Error('No Enhanced data found for user');
    }

    const finalEnhancedData = {
      strainMetrics: enhancedData.strainMetrics,
      recoveryMetrics: enhancedData.recoveryMetrics,
      heartRateMetrics: enhancedData.heartRateMetrics,
      hrvMetrics: enhancedData.hrvMetrics,
      energyMetrics: enhancedData.energyMetrics,
      whoopData: whoopData
    };

    console.log('Aggregated Enhanced Data:', finalEnhancedData);
    return finalEnhancedData;
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
