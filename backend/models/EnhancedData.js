// backend/models/EnhancedData.js
const mongoose = require('mongoose');

const enhancedDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  heartRateData: {
    maxHeartRate: Number,
    minHeartRate: Number,
    avgHeartRate: Number,
    avgRestingHeartRate: Number,
    heartRateTrend: Number,
    restingHeartRateTrend: Number,
    recommendation: String
  },
  hrvData: {
    avgHRV: Number,
    hrvVariability: Number,
    hrvTrend: Number,
    recommendation: String
  },
  strainData: {
    avgStrain: Number,
    avgCardioStrain: Number,
    avgMuscularStrain: Number,
    strainTrend: Number,
    recommendation: String
  },
  energyExpenditureData: {
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const EnhancedData = mongoose.models.EnhancedData || mongoose.model('EnhancedData', enhancedDataSchema);

module.exports = EnhancedData;
