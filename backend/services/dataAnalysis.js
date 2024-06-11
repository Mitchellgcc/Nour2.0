// backend/services/dataAnalysis.js

const EnhancedData = require('../models/EnhancedData');
const logger = require('../config/logger');

// Enhanced Analyze Heart Rate
const analyzeHeartRate = async (userId, cycles) => {
    console.log('Cycles:', cycles); // Add this line
    if (!Array.isArray(cycles)) {
        throw new Error('Invalid data format: cycles should be an array');
    }
    const heartRates = cycles.map(cycle => cycle.score.average_heart_rate);
    const restingHeartRates = cycles.map(cycle => cycle.score.resting_heart_rate || 0); // Include resting HR
    const maxHeartRate = Math.max(...heartRates);
    const minHeartRate = Math.min(...heartRates);
    const avgHeartRate = heartRates.reduce((acc, hr) => acc + hr, 0) / heartRates.length;
    const avgRestingHeartRate = restingHeartRates.reduce((acc, hr) => acc + hr, 0) / restingHeartRates.length;

    // Calculate trends
    const heartRateTrend = calculateTrend(heartRates);
    const restingHeartRateTrend = calculateTrend(restingHeartRates);

    const recommendation = avgHeartRate > 70 
        ? heartRateTrend < 0
            ? 'Consider stress management techniques and monitor physical activities'
            : 'Increase magnesium or potassium intake to support cardiovascular health'
        : 'Maintain current lifestyle; heart rate is within a healthy range';

    logger.info('Analyzed heart rate data');

    const heartRateMetrics = {
        maxHeartRate,
        minHeartRate,
        avgHeartRate,
        avgRestingHeartRate,
        heartRateTrend,
        restingHeartRateTrend,
        recommendation
    };

    await EnhancedData.findOneAndUpdate(
        { userId },
        { $set: { heartRateMetrics } },
        { upsert: true, new: true }
    );

    return heartRateMetrics;
    
};

// Improved Analyze HRV
const analyzeHRV = async (userId, recoveries) => {
    console.log('Recoveries:', recoveries); // Add this line
    if (!Array.isArray(recoveries)) {
        throw new Error('Invalid data format: recoveries should be an array');
    }
    const hrvValues = recoveries.map(recovery => recovery.score.hrv_rmssd_milli);
    const avgHRV = hrvValues.reduce((acc, hrv) => acc + hrv, 0) / hrvValues.length;

    // Calculate variability and trend
    const hrvVariability = calculateVariability(hrvValues);
    const hrvTrend = calculateTrend(hrvValues);

    const recommendation = avgHRV < 80 
        ? 'Increase intake of antioxidants and omega-3 fatty acids to improve HRV'
        : hrvTrend < 0 
            ? 'Monitor for potential fatigue or stress, and consider relaxation techniques'
            : 'HRV is optimal; continue with current health practices';

    logger.info('Analyzed HRV data');

    const hrvMetrics = {
        avgHRV,
        hrvVariability,
        hrvTrend,
        recommendation
    };

    await EnhancedData.findOneAndUpdate(
        { userId },
        { $set: { hrvMetrics } },
        { upsert: true, new: true }
    );

    return hrvMetrics;
};

// Extended Analyze Strain Score
const analyzeStrainScore = async (userId, cycles) => {
    if (!Array.isArray(cycles)) {
        throw new Error('Invalid data format: cycles should be an array');
    }
    const strainScores = cycles.map(cycle => cycle.score.strain);
    const avgStrain = strainScores.reduce((acc, strain) => acc + strain, 0) / strainScores.length;

    // Differentiate between types of strain
    const strainTypes = cycles.map(cycle => cycle.activity_type); // Example field
    const cardiovascularStrain = strainScores.filter((_, index) => strainTypes[index] === 'cardiovascular');
    const muscularStrain = strainScores.filter((_, index) => strainTypes[index] === 'muscular');
    const avgCardioStrain = cardiovascularStrain.reduce((acc, strain) => acc + strain, 0) / cardiovascularStrain.length || 0;
    const avgMuscularStrain = muscularStrain.reduce((acc, strain) => acc + strain, 0) / muscularStrain.length || 0;

    // Analyze against personal activity levels
    const strainTrend = calculateTrend(strainScores);

    const recommendation = avgStrain > 10 
        ? strainTrend < 0
            ? 'Consider adjusting workout intensity for balanced recovery'
            : 'Increase protein and carbohydrate intake post-workout to support recovery'
        : 'Maintain current nutrition; increased activity detected';

    logger.info('Analyzed strain score data');

    const strainMetrics = {
        avgStrain,
        avgCardioStrain,
        avgMuscularStrain,
        strainTrend,
        recommendation
    };

    await EnhancedData.findOneAndUpdate(
        { userId },
        { $set: { strainMetrics } },
        { upsert: true, new: true }
    );

    return strainMetrics;
};

// Expanded Analyze Energy Expenditure
const analyzeEnergyExpenditure = async (userId, cycles) => {
    if (!Array.isArray(cycles)) {
        throw new Error('Invalid data format: cycles should be an array');
    }
    const energyExpenditures = cycles.map(cycle => cycle.score.kilojoule);
    const totalEnergyExpenditure = energyExpenditures.reduce((acc, energy) => acc + energy, 0);
    const avgEnergyExpenditure = totalEnergyExpenditure / energyExpenditures.length;

    // Track energy expenditure trends
    const energyTrend = calculateTrend(energyExpenditures);

    const recommendation = totalEnergyExpenditure > 8000 
        ? energyTrend < 0 
            ? 'Maintain current caloric intake for stable energy levels'
            : 'Increase daily caloric intake to match higher activity levels'
        : 'Increase intake of balanced macronutrients to support energy needs';

    logger.info('Analyzed energy expenditure data');

    const energyMetrics = {
        totalEnergyExpenditure,
        avgEnergyExpenditure,
        energyTrend,
        recommendation
    };

    await EnhancedData.findOneAndUpdate(
        { userId },
        { $set: { energyMetrics } },
        { upsert: true, new: true }
    );

    return energyMetrics;
};

// Optimized Analyze Recovery Metrics
const analyzeRecoveryMetrics = async (userId, recoveries) => {
    if (!Array.isArray(recoveries)) {
        throw new Error('Invalid data format: recoveries should be an array');
    }
    const recoveryScores = recoveries.map(recovery => recovery.score.recovery_score);
    const avgRecoveryScore = recoveryScores.reduce((acc, score) => acc + score, 0) / recoveryScores.length;

    // Include additional recovery metrics
    const muscleSorenessScores = recoveries.map(recovery => recovery.score.muscle_soreness || 0); // Example field
    const mentalFatigueScores = recoveries.map(recovery => recovery.score.mental_fatigue || 0); // Example field
    const avgMuscleSoreness = muscleSorenessScores.reduce((acc, score) => acc + score, 0) / muscleSorenessScores.length;
    const avgMentalFatigue = mentalFatigueScores.reduce((acc, score) => acc + score, 0) / mentalFatigueScores.length;

    // Analyze recovery trends
    const recoveryTrend = calculateTrend(recoveryScores);

    const recommendation = avgRecoveryScore < 50 
        ? recoveryTrend < 0
            ? 'Focus on recovery; possible fatigue detected. Consider nutrients like zinc, iron, and vitamins C and E.'
            : 'Continue with current recovery practices and monitor for improvements'
        : 'Recovery is optimal; maintain current health and fitness regimen';

    logger.info('Analyzed recovery metrics data');

    const recoveryMetrics = {
        avgRecoveryScore,
        avgMuscleSoreness,
        avgMentalFatigue,
        recoveryTrend,
        recommendation
    };

    await EnhancedData.findOneAndUpdate(
        { userId },
        { $set: { recoveryMetrics } },
        { upsert: true, new: true }
    );

    return recoveryMetrics;
};

// Correlation Matrix Function
const calculateCorrelationMatrix = (data) => {
    const correlationMatrix = {};

    // Calculate correlations for each metric
    Object.keys(data).forEach(metric => {
        correlationMatrix[metric] = calculateCorrelations(data[metric], data);
    });

    logger.info('Calculated correlation matrix');
    return correlationMatrix;
};

// Calculate Correlations
const calculateCorrelations = (metricData, allData) => {
    const correlations = {};

    Object.keys(allData).forEach(otherMetric => {
        if (metricData !== allData[otherMetric]) {
            correlations[otherMetric] = computePearsonCorrelation(metricData, allData[otherMetric]);
        }
    });

    return correlations;
};

// Compute Pearson Correlation
const computePearsonCorrelation = (x, y) => {
    if (x.length !== y.length) {
        throw new Error('Arrays must be of the same length');
    }

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.map((_, i) => x[i] * y[i]).reduce((a, b) => a + b, 0);
    const sumX2 = x.map(a => a ** 2).reduce((a, b) => a + b, 0);
    const sumY2 = y.map(a => a ** 2).reduce((a, b) => a + b, 0);

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX ** 2)) * ((n * sumY2) - (sumY ** 2)));

    if (denominator === 0) return 0;

    return numerator / denominator;
};

// Generate Recommendation based on correlation
const generateRecommendation = (correlationValue, metric) => {
    if (correlationValue > 0.5) {
        return `Positive correlation with ${metric}. Consider dietary changes that support this metric.`;
    } else if (correlationValue < -0.5) {
        return `Negative correlation with ${metric}. Consider addressing this through dietary adjustments.`;
    } else {
        return `No strong correlation with ${metric}.`;
    }
};

// Calculate Trend
const calculateTrend = (data) => {
    if (data.length < 2) return 0;
    const latest = data.slice(-1)[0];
    const previous = data.slice(-2, -1)[0];
    return latest - previous;
};

// Calculate Variability
const calculateVariability = (data) => {
    const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
    return Math.sqrt(data.map(val => (val - mean) ** 2).reduce((acc, val) => acc + val, 0) / data.length);
};

const calculateGlycemicIndex = (meal) => {
    // Implement glycemic index calculation logic
    const estimatedGI = 50; // Placeholder value, replace with actual calculation
    return estimatedGI;
};

const calculateGlycemicLoad = (meal) => {
    // Implement glycemic load calculation logic
    const estimatedGL = (meal.carbs * calculateGlycemicIndex(meal)) / 100;
    return estimatedGL;
};

const analyzeGlycemicImpact = (meals) => {
    return meals.map(meal => {
        const glycemicIndex = calculateGlycemicIndex(meal);
        const glycemicLoad = calculateGlycemicLoad(meal);
        return {
            ...meal,
            glycemicIndex,
            glycemicLoad,
        };
    });
};

module.exports = {
    analyzeHeartRate,
    analyzeHRV,
    analyzeStrainScore,
    analyzeEnergyExpenditure,
    analyzeRecoveryMetrics,
    calculateTrend,
    calculateVariability,
    calculateCorrelationMatrix,
    computePearsonCorrelation,
    analyzeGlycemicImpact
};
