const calculateMaintenanceCalories = (user) => {
  const { weight, height, age, gender, activityLevel } = user;

  console.log('Calculating maintenance calories with data:', user);

  if (!weight || !height || !age || !gender || !activityLevel) {
    throw new Error('Incomplete user data for calculating maintenance calories');
  }

  let bmr;

  if (gender === 'Male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else if (gender === 'Female') {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  } else {
    throw new Error('Invalid gender');
  }

  const activityFactors = {
    Sedentary: 1.2,
    LightlyActive: 1.375,
    ModeratelyActive: 1.55,
    VeryActive: 1.725,
    SuperActive: 1.9
  };

  const maintenanceCalories = bmr * (activityFactors[activityLevel] || activityFactors['Sedentary']);

  console.log(`Maintenance Calories for user: ${maintenanceCalories}`);
  return Math.round(maintenanceCalories);
};

const calculateCaloricIntakeScore = (actualIntake, caloricGoal) => {
  if (!actualIntake || !caloricGoal || actualIntake <= 0 || caloricGoal <= 0) {
    console.log(`Invalid input for caloric intake score calculation: actualIntake=${actualIntake}, caloricGoal=${caloricGoal}`);
    return 0;
  }

  const intakePercentage = (actualIntake / caloricGoal) * 100;
  console.log(`Caloric Intake: ${actualIntake}, Goal: ${caloricGoal}, Intake Percentage: ${intakePercentage}`);

  let score;
  if (intakePercentage <= 95) {
    score = intakePercentage;
  } else if (intakePercentage > 95 && intakePercentage <= 110) {
    score = 100;
  } else {
    score = 100 - ((intakePercentage - 110) * 0.5);
    score = Math.max(0, score);
  }

  console.log(`Caloric Intake Score: ${score}`);
  return score;
};

const calculateMacroNutrientBalanceScore = (macronutrients, userGoals) => {
  if (!macronutrients || !userGoals ||
      !Number.isFinite(macronutrients.proteins) ||
      !Number.isFinite(macronutrients.carbohydrates) ||
      !Number.isFinite(macronutrients.fats) ||
      !Number.isFinite(userGoals.proteins) ||
      !Number.isFinite(userGoals.carbohydrates) ||
      !Number.isFinite(userGoals.fats)) {
    console.log('Invalid input for macro nutrient balance score calculation');
    return 0;
  }

  const proteinRatio = userGoals.proteins > 0 ? macronutrients.proteins / userGoals.proteins : 0;
  const carbRatio = userGoals.carbohydrates > 0 ? macronutrients.carbohydrates / userGoals.carbohydrates : 0;
  const fatRatio = userGoals.fats > 0 ? macronutrients.fats / userGoals.fats : 0;

  console.log(`Protein Ratio: ${proteinRatio}, Carb Ratio: ${carbRatio}, Fat Ratio: ${fatRatio}`);

  const proteinScore = proteinRatio >= 0.8 && proteinRatio <= 1.2 ? (proteinRatio - 0.8) / (1.2 - 0.8) * 100 : (proteinRatio < 0.8 ? (proteinRatio / 0.8) * 100 : (1.2 / proteinRatio) * 100);
  const carbScore = carbRatio >= 0.8 && carbRatio <= 1.2 ? (carbRatio - 0.8) / (1.2 - 0.8) * 100 : (carbRatio < 0.8 ? (carbRatio / 0.8) * 100 : (1.2 / carbRatio) * 100);
  const fatScore = fatRatio >= 0.8 && fatRatio <= 1.2 ? (fatRatio - 0.8) / (1.2 - 0.8) * 100 : (fatRatio < 0.8 ? (fatRatio / 0.8) * 100 : (1.2 / fatRatio) * 100);

  console.log(`Protein Score: ${proteinScore}, Carb Score: ${carbScore}, Fat Score: ${fatScore}`);

  const macroBalance = (proteinScore + carbScore + fatScore) / 3;
  console.log(`Macro Nutrient Balance Score: ${macroBalance}`);

  return Math.max(0, Math.min(100, macroBalance));
};

const calculateMicroNutrientIntakeScore = (micronutrients, userGoals) => {
  if (!micronutrients || Object.keys(micronutrients).length === 0 || !userGoals || Object.keys(userGoals).length === 0) {
    console.log('Invalid input for micro nutrient intake score calculation');
    return 0;
  }

  let totalScore = 0;
  let nutrientsCount = 0;

  for (const [nutrient, goal] of Object.entries(userGoals)) {
    if (micronutrients[nutrient] !== undefined) {
      const intake = micronutrients[nutrient];
      const ratio = intake / goal;

      console.log(`Calculating score for ${nutrient}: intake=${intake}, goal=${goal}, ratio=${ratio}`);

      let score;
      if (ratio >= 1) {
        score = Math.min(100, 100 - (ratio - 1) * 10); // Penalty for excess
      } else {
        score = ratio * 100; // Proportional score for deficiencies
      }

      console.log(`Score for ${nutrient}: ${score}`);

      totalScore += score;
      nutrientsCount++;
    }
  }

  const averageScore = totalScore / nutrientsCount;
  console.log(`Micro Nutrient Intake Score: ${averageScore}`);

  return Math.max(0, Math.min(100, averageScore));
};

const calculateHydrationLevelScore = (hydrationMetrics) => {
  if (!hydrationMetrics || !Number.isFinite(hydrationMetrics.current) || hydrationMetrics.current <= 0 ||
      !Number.isFinite(hydrationMetrics.goal) || hydrationMetrics.goal <= 0) {
    console.log('Invalid input for hydration level score calculation');
    return 0;
  }

  const hydrationPercentage = (hydrationMetrics.current / hydrationMetrics.goal) * 100;
  console.log(`Hydration Current: ${hydrationMetrics.current}, Goal: ${hydrationMetrics.goal}, Percentage: ${hydrationPercentage}`);
  return Math.min(100, hydrationPercentage);
};

const calculateNourScore = (caloricIntakeScore, macroNutrientScore, microNutrientScore, hydrationScore) => {
  if (!Number.isFinite(caloricIntakeScore) || !Number.isFinite(macroNutrientScore) ||
      !Number.isFinite(microNutrientScore) || !Number.isFinite(hydrationScore)) {
    console.log('Invalid input for overall NourScore calculation');
    return 0;
  }

  const caloricWeight = 0.3;
  const macroWeight = 0.25;
  const microWeight = 0.2;
  const hydrationWeight = 0.25;

  const totalWeight = caloricWeight + macroWeight + microWeight + hydrationWeight;
  
  const overallScore = (
    (caloricIntakeScore * caloricWeight) +
    (macroNutrientScore * macroWeight) +
    (microNutrientScore * microWeight) +
    (hydrationScore * hydrationWeight)
  ) / totalWeight;

  console.log(`Overall NourScore: ${overallScore}`);
  return Math.round(overallScore);
};

module.exports = {
  calculateCaloricIntakeScore,
  calculateMacroNutrientBalanceScore,
  calculateMicroNutrientIntakeScore,
  calculateHydrationLevelScore,
  calculateMaintenanceCalories,
  calculateNourScore
};
