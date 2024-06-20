const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define UserFeedback schema
const userFeedbackSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  feedbackDate: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,  // Ensure rating is required
  },
  comments: {
    type: String,
    default: '',
  },
  mealId: {
    type: Schema.Types.ObjectId,
    ref: 'Meal',
    required: true,  // Ensure mealId is required
  },
}, { timestamps: true });

// Create UserFeedback model
const UserFeedback = mongoose.model('UserFeedback', userFeedbackSchema);

module.exports = UserFeedback;
