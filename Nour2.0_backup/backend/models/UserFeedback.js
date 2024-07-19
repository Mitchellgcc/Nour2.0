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
    required: true,
  },
  comments: {
    type: String,
    default: '',
  },
  mealId: {
    type: Schema.Types.ObjectId,
    ref: 'Meal',
    required: true,
  },
  taste: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  portionSize: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  satisfaction: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  context: {
    type: String,
    enum: ['post-workout', 'during travel', 'regular meal'],
    required: false
  }
}, { timestamps: true });

// Create UserFeedback model
const UserFeedback = mongoose.model('UserFeedback', userFeedbackSchema);

module.exports = UserFeedback;
