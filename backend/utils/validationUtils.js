// Nour2.0/backend/utils/validationUtils.js

function isValidAnalysisResult(result) {
  console.log("Validating structured analysis result:", JSON.stringify(result, null, 2));

  if (!result || !result.items || !Array.isArray(result.items) || result.items.length === 0) {
    console.error('Validation failed: items array is missing or empty');
    return false;
  }

  for (const item of result.items) {
    if (
      typeof item.name !== 'string' ||
      typeof item.quantity !== 'number' ||
      typeof item.totalCalories !== 'number' ||
      !item.macronutrients ||
      typeof item.macronutrients.proteins !== 'number' ||
      typeof item.macronutrients.carbohydrates !== 'number' ||
      typeof item.macronutrients.fats !== 'number' ||
      typeof item.macronutrients.sodium !== 'number' ||
      typeof item.macronutrients.cholesterol !== 'number' ||
      typeof item.macronutrients.waterContent !== 'number' ||
      typeof item.macronutrients.omega3 !== 'number' ||
      typeof item.macronutrients.omega6 !== 'number' ||
      typeof item.macronutrients.solubleFiber !== 'number' ||
      typeof item.macronutrients.insolubleFiber !== 'number' ||
      !item.micronutrients ||
      typeof item.glycemicIndex !== 'number' ||
      typeof item.glycemicLoad !== 'number'
    ) {
      console.error('Validation failed: Invalid item structure', item);
      return false;
    }

    for (const key in item.micronutrients) {
      if (typeof item.micronutrients[key] !== 'number') {
        console.error(`Validation failed: Micronutrient ${key} is not a number`, item.micronutrients[key]);
        return false;
      }
    }
  }

  if (
    !result.summary ||
    typeof result.summary.totalCalories !== 'number' ||
    !result.summary.macronutrients ||
    typeof result.summary.macronutrients.proteins !== 'number' ||
    typeof result.summary.macronutrients.carbohydrates !== 'number' ||
    typeof result.summary.macronutrients.fats !== 'number' ||
    typeof result.summary.macronutrients.sodium !== 'number' ||
    typeof result.summary.macronutrients.cholesterol !== 'number' ||
    typeof result.summary.macronutrients.waterContent !== 'number' ||
    typeof result.summary.macronutrients.omega3 !== 'number' ||
    typeof result.summary.macronutrients.omega6 !== 'number' ||
    typeof result.summary.macronutrients.solubleFiber !== 'number' ||
    typeof result.summary.macronutrients.insolubleFiber !== 'number'
  ) {
    console.error('Validation failed: Invalid summary structure', result.summary);
    return false;
  }

  for (const key in result.summary.micronutrients) {
    if (typeof result.summary.micronutrients[key] !== 'number') {
      console.error(`Validation failed: Summary micronutrient ${key} is not a number`, result.summary.micronutrients[key]);
      return false;
    }
  }

  if (
    typeof result.summary.glycemicIndex !== 'number' ||
    typeof result.summary.glycemicLoad !== 'number'
  ) {
    console.error('Validation failed: Glycemic index/load is not a number', result.summary);
    return false;
  }

  console.log("Validation passed: Structured analysis result is valid");
  return true;
}

function parseAndConvertAnalysisResult(analysisResult) {
  console.log("Before conversion:", JSON.stringify(analysisResult, null, 2));

  function stripUnits(value) {
    const strippedValue = parseFloat(value.replace(/[^\d.-]/g, ''));
    console.log(`Stripping units from "${value}" to get ${strippedValue}`);
    return strippedValue;
  }

  // Ensure quantity and totalCalories are numbers
  for (let item of analysisResult.items) {
    console.log(`Converting item: ${JSON.stringify(item)}`);
    item.quantity = stripUnits(item.quantity);
    item.totalCalories = stripUnits(item.totalCalories);
    item.macronutrients.proteins = stripUnits(item.macronutrients.proteins);
    item.macronutrients.carbohydrates = stripUnits(item.macronutrients.carbohydrates);
    item.macronutrients.fats = stripUnits(item.macronutrients.fats);
    item.macronutrients.sodium = stripUnits(item.macronutrients.sodium);
    item.macronutrients.cholesterol = stripUnits(item.macronutrients.cholesterol);
    item.macronutrients.waterContent = stripUnits(item.macronutrients.waterContent);
    item.macronutrients.omega3 = stripUnits(item.macronutrients.omega3);
    item.macronutrients.omega6 = stripUnits(item.macronutrients.omega6);
    item.macronutrients.solubleFiber = stripUnits(item.macronutrients.solubleFiber);
    item.macronutrients.insolubleFiber = stripUnits(item.macronutrients.insolubleFiber);

    for (let key in item.micronutrients) {
      item.micronutrients[key] = stripUnits(item.micronutrients[key]);
    }

    item.glycemicIndex = stripUnits(item.glycemicIndex);
    item.glycemicLoad = stripUnits(item.glycemicLoad);
  }

  analysisResult.summary.totalCalories = stripUnits(analysisResult.summary.totalCalories);
  for (let key in analysisResult.summary.macronutrients) {
    analysisResult.summary.macronutrients[key] = stripUnits(analysisResult.summary.macronutrients[key]);
  }
  for (let key in analysisResult.summary.micronutrients) {
    analysisResult.summary.micronutrients[key] = stripUnits(analysisResult.summary.micronutrients[key]);
  }
  analysisResult.summary.glycemicIndex = stripUnits(analysisResult.summary.glycemicIndex);
  analysisResult.summary.glycemicLoad = stripUnits(analysisResult.summary.glycemicLoad);

  console.log("After conversion:", JSON.stringify(analysisResult, null, 2));

  return analysisResult;
}

module.exports = { isValidAnalysisResult, parseAndConvertAnalysisResult };
