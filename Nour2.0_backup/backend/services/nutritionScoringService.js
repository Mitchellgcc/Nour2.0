// backend/services/nutritionScoringService.js

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
  
  const validateNutrients = (nutrients) => {
    if (!nutrients || typeof nutrients !== 'object') {
      console.warn('Invalid nutrients object:', nutrients);
      return false;
    }
    return true;
  };
  
  const calculateNutrientDensityScore = (nutrients, totalCalories) => {
    console.log('Calculating Nutrient Density Score with nutrients:', nutrients, 'and totalCalories:', totalCalories);
    if (!validateNutrients(nutrients)) return 0;
    
    const essentialNutrients = ['Vitamin A', 'Vitamin C', 'Calcium', 'Iron', 'Fiber', 'Protein', 'Potassium'];
    let nutrientSum = 0;
  
    essentialNutrients.forEach(nutrient => {
      if (nutrients[nutrient] !== undefined && nutrients[nutrient] !== null) {
        const weight = getOptimizedNutrientWeight(nutrient);
        nutrientSum += nutrients[nutrient] * weight;
        console.log(`Adding ${nutrients[nutrient]} * ${weight} for ${nutrient}`);
      } else {
        console.warn(`Nutrient ${nutrient} is missing or invalid`);
      }
    });
  
    const score = nutrientSum / (totalCalories || 1); // Prevent division by zero
    console.log('Calculated Nutrient Density Score:', score);
    return score;
  };
  
  const calculateHealthImpactScore = (nutrients, userHealthProfile) => {
    console.log('Calculating Health Impact Score with nutrients:', nutrients, 'and userHealthProfile:', userHealthProfile);
    if (!validateNutrients(nutrients)) return 0;
    
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
        console.log(`Adding positive impact of ${nutrients[nutrient]} * ${positiveNutrients[nutrient]} for ${nutrient}`);
      }
      if (negativeNutrients[nutrient]) {
        score += nutrients[nutrient] * negativeNutrients[nutrient]; // Ensure negative impact
        console.log(`Adding negative impact of ${nutrients[nutrient]} * ${negativeNutrients[nutrient]} for ${nutrient}`);
      }
    });
  
    // Adjust score based on user-specific health conditions
    if (userHealthProfile.conditions.includes('cardiovascular')) {
      const omega3Impact = nutrients['Omega-3'] ? nutrients['Omega-3'] * 2 : 0;
      score += omega3Impact;
      console.log(`Adjusting score for cardiovascular condition with Omega-3 impact: ${omega3Impact}`);
    }
  
    console.log('Calculated Health Impact Score:', score);
    return score;
  };
  
  const calculateInflammationScore = (nutrients, userHealthProfile) => {
    console.log('Calculating Inflammation Score with nutrients:', nutrients, 'and userHealthProfile:', userHealthProfile);
    if (!validateNutrients(nutrients)) return 0;
    
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
        console.log(`Adding anti-inflammatory impact of ${nutrients[nutrient]} * ${antiInflammatoryNutrients[nutrient]} for ${nutrient}`);
      }
      if (proInflammatoryNutrients[nutrient]) {
        score += nutrients[nutrient] * proInflammatoryNutrients[nutrient];
        console.log(`Adding pro-inflammatory impact of ${nutrients[nutrient]} * ${proInflammatoryNutrients[nutrient]} for ${nutrient}`);
      }
    });
  
    // Adjust score based on user's inflammatory conditions
    if (userHealthProfile.conditions.includes('arthritis')) {
      score *= 1.5; // Increase sensitivity to inflammation
      console.log('Adjusting score for arthritis condition. New score:', score);
    }
  
    console.log('Calculated Inflammation Score:', score);
    return score;
  };
  
  const calculateOxidativeStressScore = (nutrients, userHealthProfile) => {
    console.log('Calculating Oxidative Stress Score with nutrients:', nutrients, 'and userHealthProfile:', userHealthProfile);
    if (!validateNutrients(nutrients)) return 0;
    
    const antioxidants = ['Vitamin C', 'Vitamin E', 'Polyphenols', 'Glutathione'];
    let score = 0;
  
    antioxidants.forEach(nutrient => {
      if (nutrients[nutrient]) {
        score += nutrients[nutrient];
        console.log(`Adding antioxidant impact of ${nutrients[nutrient]} for ${nutrient}`);
      }
    });
  
    // Adjust score for users with high oxidative stress levels
    if (userHealthProfile.stressLevels.high) {
      score *= 1.2; // Ensure proper multiplication for high stress
      console.log('Adjusting score for high stress levels. New score:', score);
    }
  
    console.log('Calculated Oxidative Stress Score:', score);
    return score;
  };
  
  const calculateMicrobiomeImpactScore = (nutrients, userHealthProfile) => {
    console.log('Calculating Microbiome Impact Score with nutrients:', nutrients, 'and userHealthProfile:', userHealthProfile);
    if (!validateNutrients(nutrients)) return 0;
    
    const beneficialComponents = ['Fiber', 'Prebiotics', 'Probiotics', 'Resistant Starch'];
    let score = 0;
  
    beneficialComponents.forEach(component => {
      if (nutrients[component]) {
        score += nutrients[component];
        console.log(`Adding microbiome impact of ${nutrients[component]} for ${component}`);
      }
    });
  
    // Adjust for users with gut health issues
    if (userHealthProfile.conditions.includes('IBS')) {
      score *= 1.5; // Emphasize gut health
      console.log('Adjusting score for IBS condition. New score:', score);
    }
  
    console.log('Calculated Microbiome Impact Score:', score);
    return score;
  };
  
  const calculateMealScores = (meal) => {
    console.log('Calculating Meal Scores for meal:', meal);
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
  
    const scores = {
      nutrientDensityScore,
      healthImpactScore,
      inflammationScore,
      oxidativeStressScore,
      microbiomeImpactScore
    };
  
    console.log('Calculated Meal Scores:', scores);
    return scores;
  };
  
  module.exports = {
    calculateMealScores,
    calculateNutrientDensityScore,
    calculateHealthImpactScore,
    calculateInflammationScore,
    calculateOxidativeStressScore,
    calculateMicrobiomeImpactScore
  };
  