// backend/controllers/mealController.js
const Meal = require('../models/Meal');

// Get all meals
exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.findAll({ where: { userId: req.user.id } });
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single meal
exports.getMeal = async (req, res) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    if (!meal || meal.userId !== req.user.id) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new meal
exports.createMeal = async (req, res) => {
  try {
    const { name, description, calories } = req.body;
    const meal = await Meal.create({ name, description, calories, userId: req.user.id });
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update meal
exports.updateMeal = async (req, res) => {
  try {
    const { name, description, calories } = req.body;
    const meal = await Meal.findByPk(req.params.id);
    if (!meal || meal.userId !== req.user.id) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    meal.name = name || meal.name;
    meal.description = description || meal.description;
    meal.calories = calories || meal.calories;
    await meal.save();
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete meal
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    if (!meal || meal.userId !== req.user.id) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    await meal.destroy();
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
