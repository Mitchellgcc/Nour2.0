// backend/services/scoringService.js

const getOptimizedNutrientWeight = (nutrient) => {
    const weights = {
        'Vitamin A': 0.4,
        'Vitamin C': 0.6,
        'Calcium': 0.5,
        'Iron': 0.5,
        'Fiber': 1.0,
        'Protein': 1.2,
        'Potassium': 0.7
    };
    return weights[nutrient] || 0;
};

const calculateNutrientDensityScore = (nutrients, totalCalories) => {
    const essentialNutrients = ['Vitamin A', 'Vitamin C', 'Calcium', 'Iron', 'Fiber', 'Protein', 'Potassium'];
    let nutrientSum = 0;

    essentialNutrients.forEach(nutrient => {
        if (nutrients[nutrient]) {
            nutrientSum += nutrients[nutrient] * getOptimizedNutrientWeight(nutrient);
        }
    });

    return nutrientSum / (totalCalories || 1); // Prevent division by zero
};

const calculateHealthImpactScore = (nutrients, userHealthProfile) => {
    const positiveNutrients = {
        'Vitamin A': 2,
        'Vitamin C': 2,
        'Fiber': 3,
        'Omega-3': 3,
        'Antioxidants': 2
    };
    const negativeNutrients = {
        'Saturated Fat': -3,
        'Trans Fat': -5,
        'Sodium': -2,
        'Sugar': -2
    };

    let score = 0;

    Object.keys(nutrients).forEach(nutrient => {
        if (positiveNutrients[nutrient]) {
            score += nutrients[nutrient] * positiveNutrients[nutrient];
        }
        if (negativeNutrients[nutrient]) {
            score += nutrients[nutrient] * negativeNutrients[nutrient]; // Ensure negative impact
        }
    });

    // Adjust score based on user-specific health conditions
    if (userHealthProfile.conditions.includes('cardiovascular')) {
        score += nutrients['Omega-3'] ? nutrients['Omega-3'] * 2 : 0;
    }

    return score;
};

const calculateInflammationScore = (nutrients, userHealthProfile) => {
    const antiInflammatoryNutrients = {
        'Omega-3': -3,
        'Vitamin E': -2,
        'Polyphenols': -2,
        'Curcumin': -3
    };
    const proInflammatoryNutrients = {
        'Omega-6': 3,
        'Saturated Fat': 2,
        'Refined Carbs': 3
    };

    let score = 0;

    Object.keys(nutrients).forEach(nutrient => {
        if (antiInflammatoryNutrients[nutrient]) {
            score += nutrients[nutrient] * antiInflammatoryNutrients[nutrient];
        }
        if (proInflammatoryNutrients[nutrient]) {
            score += nutrients[nutrient] * proInflammatoryNutrients[nutrient];
        }
    });

    // Adjust score based on user's inflammatory conditions
    if (userHealthProfile.conditions.includes('arthritis')) {
        score *= 1.5; // Increase sensitivity to inflammation
    }

    return score;
};

const calculateOxidativeStressScore = (nutrients, userHealthProfile) => {
    const antioxidants = ['Vitamin C', 'Vitamin E', 'Polyphenols', 'Glutathione'];
    let score = 0;

    antioxidants.forEach(nutrient => {
        if (nutrients[nutrient]) {
            score += nutrients[nutrient];
        }
    });

    // Adjust score for users with high oxidative stress levels
    if (userHealthProfile.stressLevels.high) {
        score *= 1.2; // Ensure proper multiplication for high stress
    }

    return score;
};

const calculateMicrobiomeImpactScore = (nutrients, userHealthProfile) => {
    const beneficialComponents = ['Fiber', 'Prebiotics', 'Probiotics', 'Resistant Starch'];
    let score = 0;

    beneficialComponents.forEach(component => {
        if (nutrients[component]) {
            score += nutrients[component];
        }
    });

    // Adjust for users with gut health issues
    if (userHealthProfile.conditions.includes('IBS')) {
        score *= 1.5; // Emphasize gut health
    }

    return score;
};

const calculateMealScores = (meal) => {
    // Mock user health profile for testing
    const userHealthProfile = {
        conditions: ['cardiovascular'], // Example conditions
        stressLevels: {
            high: false
        }
    };

    const nutrients = meal.nutrients || {}; // Ensure nutrients are defined

    const nutrientDensityScore = calculateNutrientDensityScore(nutrients, meal.totalCalories);
    const healthImpactScore = calculateHealthImpactScore(nutrients, userHealthProfile);
    const inflammationScore = calculateInflammationScore(nutrients, userHealthProfile);
    const oxidativeStressScore = calculateOxidativeStressScore(nutrients, userHealthProfile);
    const microbiomeImpactScore = calculateMicrobiomeImpactScore(nutrients, userHealthProfile);

    return {
        nutrientDensityScore,
        healthImpactScore,
        inflammationScore,
        oxidativeStressScore,
        microbiomeImpactScore
    };
};

const scoringService = {
    calculateMealScores,
    calculateNutrientDensityScore,
    calculateHealthImpactScore,
    calculateInflammationScore,
    calculateOxidativeStressScore,
    calculateMicrobiomeImpactScore
};

module.exports = scoringService;
