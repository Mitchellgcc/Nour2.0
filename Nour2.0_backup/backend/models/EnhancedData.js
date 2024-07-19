const mongoose = require('mongoose');

const enhancedDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  heartRateMetrics: {
    maxHeartRate: Number,
    minHeartRate: Number,
    avgHeartRate: Number,
    avgRestingHeartRate: Number,
    heartRateTrend: Number,
    restingHeartRateTrend: Number,
    recommendation: String
  },
  hrvMetrics: {
    avgHRV: Number,
    hrvVariability: Number,
    hrvTrend: Number,
    recommendation: String
  },
  strainMetrics: {
    avgStrain: Number,
    avgCardioStrain: Number,
    avgMuscularStrain: Number,
    strainTrend: Number,
    recommendation: String
  },
  energyMetrics: {
    totalEnergyExpenditure: Number,
    avgEnergyExpenditure: Number,
    energyTrend: Number,
    recommendation: String
  },
  recoveryMetrics: {
    avgRecoveryScore: Number,
    avgMuscleSoreness: Number,
    avgMentalFatigue: Number,
    recoveryTrend: Number,
    recommendation: String
  },
  nutritionalIntake: {
    totalCalories: Number,
    macronutrients: {
      proteins: Number,
      carbohydrates: Number,
      fats: Number
    },
    micronutrients: {
      vitamins: { type: Map, of: Number },
      minerals: { type: Map, of: Number }
    },
    hydrationLevel: Number,
  },
  sleepQuality: {
    avgSleepScore: Number,
    avgSleepDuration: Number,
    sleepTrend: Number,
    recommendation: String
  },
  workoutIntensity: {
    avgIntensity: Number,
    recommendation: String
  },
  steps: { type: Number, required: false },
  distance: { type: Number, required: false },
  activeMinutes: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const EnhancedData = mongoose.models.EnhancedData || mongoose.model('EnhancedData', enhancedDataSchema);

module.exports = EnhancedData;
