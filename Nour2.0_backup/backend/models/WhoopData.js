// backend/models/WhoopData.js
const mongoose = require('mongoose');

const whoopDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  profile: { type: Object, required: true },
  cycles: { type: Array, required: true },
  recoveries: { type: Array, required: true },
  sleepData: { type: Array, required: true },
  workouts: { type: Array, required: true },
  steps: { type: Number, required: false },
  distance: { type: Number, required: false },
  activeMinutes: { type: Number, required: false },
}, { timestamps: true });

const WhoopData = mongoose.models.WhoopData || mongoose.model('WhoopData', whoopDataSchema);

module.exports = WhoopData;
