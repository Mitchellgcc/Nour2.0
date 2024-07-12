const WhoopData = require('../models/WhoopData');
const User = require('../models/User');
const { Meal } = require('../models/Meal');
const {
  analyzeHeartRate,
  analyzeHRV,
  analyzeStrainScore,
  analyzeEnergyExpenditure,
  analyzeRecoveryMetrics,
  calculateCorrelationMatrix,
  analyzeGlycemicImpact,
} = require('./dataAnalysis');

const getRecommendations = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    const whoopData = await WhoopData.findOne({ where: { userId } });
    const meals = await Meal.findAll({ where: { userId } });

    if (!whoopData) {
      console.error(`Whoop data not found for user ID: ${userId}`);
      return { error: 'Whoop data not found' };
    }

    if (meals.length === 0) {
      console.warn(`Meals not found for user ID: ${userId}`);
      return { warning: 'Meals not found', recommendations: [] };
    }

    const userPreferences = user.dietaryPreferences || {};

    let cycles = whoopData.cycles;
    if (!Array.isArray(cycles)) {
      console.error(`Invalid data format for cycles: ${cycles}`);
      throw new Error('Invalid data format: cycles should be an array');
    }

    const heartRateRecommendations = await analyzeHeartRate(userId, cycles);
    const hrvRecommendations = await analyzeHRV(userId, whoopData.recoveries);
    const strainRecommendations = await analyzeStrainScore(userId, cycles);
    const energyRecommendations = await analyzeEnergyExpenditure(userId, cycles);
    const recoveryRecommendations = await analyzeRecoveryMetrics(userId, whoopData.recoveries);
    const glycemicImpact = analyzeGlycemicImpact(meals);

    const data = {
      heartRate: whoopData.cycles.map(cycle => cycle.score.average_heart_rate),
      hrv: whoopData.recoveries.map(recovery => recovery.score.hrv_rmssd_milli),
      strain: whoopData.cycles.map(cycle => cycle.score.strain),
      energy: whoopData.cycles.map(cycle => cycle.score.kilojoule),
      recovery: whoopData.recoveries.map(recovery => recovery.score.recovery_score),
    };

    const minLength = Math.min(...Object.values(data).map(arr => arr.length));
    Object.keys(data).forEach(key => {
      data[key] = data[key].slice(0, minLength);
    });

    const correlationMatrix = calculateCorrelationMatrix(data);

    return {
      heartRateRecommendations,
      hrvRecommendations,
      strainRecommendations,
      energyRecommendations,
      recoveryRecommendations,
      glycemicImpact,
      correlationMatrix,
    };
  } catch (error) {
    console.error('Error in getRecommendations:', error.message);
    throw error;
  }
};

async function deriveInsights() {
  try {
    const whoopData = await WhoopData.findAll(); // Adjusted from find() to findAll()
    for (const data of whoopData) {
      const userId = data.userId;
      console.log(`Processing user ID: ${userId}`);
      const user = await User.findByPk(userId);
      if (!user) {
        console.error(`User not found: ${userId}`);
        continue;
      }
      await getRecommendations(userId);
    }
  } catch (error) {
    console.error('Error in deriveInsights:', error);
  }
}

module.exports = {
  getRecommendations,
  deriveInsights,
};
