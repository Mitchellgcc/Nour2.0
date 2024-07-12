const {
    calculateMaintenanceCalories,
    calculateCaloricIntakeScore,
    calculateMacroNutrientBalanceScore,
    calculateMicroNutrientIntakeScore,
    calculateHydrationLevelScore,
    calculateNourScore
} = require('../utils/scoringUtils');
const DataAggregationService = require('./DataAggregationService');

const calculateNourScoreForUser = async (user) => {
    try {
        const aggregatedData = await DataAggregationService.aggregateNutritionalData(user.id);
        await DataAggregationService.saveOrUpdateNutritionalData(user.id, aggregatedData);

        console.log('Aggregated Data for NourScore calculation:', aggregatedData);

        const location = 'London'; // Replace this with the actual location
        let temperature;
        try {
            temperature = await DataAggregationService.fetchTemperatureData(location);
            console.log('Temperature data:', temperature);
        } catch (error) {
            console.error('Error fetching temperature data:', error);
            temperature = 'N/A'; // Default to 'N/A' if fetching fails
        }

        console.log('Aggregated data used for NourScore calculation:', aggregatedData);

        const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();
        console.log('User data for maintenance calories calculation:', {
            weight: user.weight,
            height: user.height,
            age: age,
            gender: user.gender,
            activityLevel: user.activityLevel
        });

        const caloricIntakeScore = calculateCaloricIntakeScore(aggregatedData.totalCalories, calculateMaintenanceCalories({
            weight: user.weight,
            height: user.height,
            age: age,
            gender: user.gender,
            activityLevel: user.activityLevel
        }));
        console.log('Caloric Intake Score:', caloricIntakeScore);

        const macroNutrientScore = calculateMacroNutrientBalanceScore(aggregatedData.macronutrients, user.nutritionalGoals);
        console.log('Macro Nutrient Score:', macroNutrientScore);

        const microNutrientScore = calculateMicroNutrientIntakeScore(aggregatedData.micronutrients, user.nutritionalGoals);
        console.log('Micro Nutrient Score:', microNutrientScore);

        const hydrationScore = calculateHydrationLevelScore({ current: aggregatedData.hydrationLevel, goal: user.hydrationGoal });
        console.log('Hydration Score:', hydrationScore);

        const overallNourScore = calculateNourScore(caloricIntakeScore, macroNutrientScore, microNutrientScore, hydrationScore);
        console.log('Calculated NourScore:', overallNourScore);

        return {
            nourScore: overallNourScore,
            individualMetrics: {
                calories: caloricIntakeScore,
                proteins: macroNutrientScore,
                fats: macroNutrientScore,
                carbs: macroNutrientScore,
                hydration: hydrationScore
            }
        };
    } catch (error) {
        console.error('Error calculating NourScore:', error);
        throw error;
    }
};


const getAggregatedDataForUser = async (userId) => {
    return await DataAggregationService.aggregateNutritionalData(userId);
};

module.exports = { calculateNourScoreForUser, getAggregatedDataForUser };
