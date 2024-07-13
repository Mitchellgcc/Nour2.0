// backend/controllers/nextMealController.js
const {
  fetchAndDisplayNewMeal,
  swipeMeal,
  markMealAsFavorite,
  submitFeedback,
  getMealRecommendations,
  adjustMealPlan,
  aggregateUserData,
  fetchMealById
} = require('../services/nextMealService');
const mongoose = require('mongoose');
const logger = require('../config/logger');

const getNextMeal = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    logger.info(`getNextMeal called with userId: ${userId}`);
    const nextMeal = await fetchAndDisplayNewMeal(userId);
    logger.info('getNextMeal response:', nextMeal);
    res.status(200).json(nextMeal);
  } catch (error) {
    logger.error('Error getting next meal:', error);
    res.status(500).json({ message: 'Error getting next meal' });
  }
};

const handleSwipeMeal = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    const { direction } = req.body;
    logger.info(`handleSwipeMeal called with userId: ${userId}, direction: ${direction}`);
    const meal = await swipeMeal(direction, userId);
    logger.info('handleSwipeMeal response:', meal);
    res.status(200).json(meal);
  } catch (error) {
    logger.error('Error handling meal swipe:', error);
    res.status(500).json({ message: 'Error handling meal swipe' });
  }
};

const favoriteMeal = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    const { mealId } = req.body;
    logger.info(`favoriteMeal called with userId: ${userId}, mealId: ${mealId}`);

    if (!mongoose.Types.ObjectId.isValid(mealId)) {
      logger.error('Invalid Meal ID format');
      return res.status(400).json({ message: 'Invalid Meal ID format' });
    }

    const response = await markMealAsFavorite(userId, mealId);
    logger.info('favoriteMeal response:', response);
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error marking meal as favorite:', error);
    res.status(500).json({ message: 'Error marking meal as favorite' });
  }
};

const submitMealFeedback = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    const { mealId, feedback } = req.body;
    logger.info(`submitMealFeedback called with userId: ${userId}, mealId: ${mealId}`);

    if (!mongoose.Types.ObjectId.isValid(mealId)) {
      logger.error('Invalid Meal ID format');
      return res.status(400).json({ message: 'Invalid Meal ID format' });
    }

    const response = await submitFeedback(userId, mealId, feedback.rating, feedback.comments);
    logger.info('submitMealFeedback response:', response);
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
};

const getRecommendations = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    logger.info(`getRecommendations called with userId: ${userId}`);
    const userData = await aggregateUserData(userId);
    const recommendations = await getMealRecommendations(userData);
    logger.info('getRecommendations response:', recommendations);
    res.status(200).json({ recommendations });
  } catch (error) {
    logger.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
};

const updateMealPlan = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const userId = req.user.id;
    const { healthData } = req.body;
    logger.info(`updateMealPlan called with userId: ${userId}, healthData: ${JSON.stringify(healthData)}`);
    const updatedPlan = await adjustMealPlan(userId, healthData);
    logger.info('updateMealPlan response:', updatedPlan);
    res.status(200).json({ updatedPlan });
  } catch (error) {
    logger.error('Error updating meal plan:', error);
    res.status(500).json({ message: 'Error updating meal plan' });
  }
};

const getMealById = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    const { id } = req.params;
    logger.info(`getMealById called with meal ID: ${id}`);
    const meal = await fetchMealById(id);
    logger.info('getMealById response:', meal);
    res.status(200).json(meal);
  } catch (error) {
    logger.error('Error getting meal by ID:', error);
    res.status(500).json({ message: 'Error getting meal by ID' });
  }
};

module.exports = {
  getNextMeal,
  handleSwipeMeal,
  favoriteMeal,
  submitMealFeedback,
  getRecommendations,
  updateMealPlan,
  getMealById
};
