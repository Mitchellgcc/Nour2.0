const Meal = require('../models/Meal');

// Helper function to validate UUID
const validateUUID = (id) => {
    const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return regex.test(id);
};

// Get all meals
const getMeals = async (req, res) => {
    try {
        const meals = await Meal.findAll({ where: { userId: req.user.id } });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single meal
const getMeal = async (req, res) => {
    try {
        const mealId = req.params.id;
        if (!validateUUID(mealId)) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        const meal = await Meal.findByPk(mealId);
        if (!meal || meal.userId !== req.user.id) {
            return res.status(404).json({ message: 'Meal not found' });
        }
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new meal
const createMeal = async (req, res) => {
    try {
        const {
            name,
            description,
            calories,
            protein,
            carbs,
            fat,
            micronutrients,
            vitamins,
            minerals,
            glycemicIndex,
            glycemicLoad,
            waterContent,
            omega3,
            omega6,
            polyphenols,
            antioxidants,
            solubleFiber,
            insolubleFiber,
            sodium,
            cholesterol,
            fiber,
            sugar
        } = req.body;

        if (!name || !calories || !protein || !carbs || !fat) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const meal = await Meal.create({
            name,
            description,
            calories,
            protein,
            carbs,
            fat,
            micronutrients,
            vitamins,
            minerals,
            glycemicIndex,
            glycemicLoad,
            waterContent,
            omega3,
            omega6,
            polyphenols,
            antioxidants,
            solubleFiber,
            insolubleFiber,
            sodium,
            cholesterol,
            fiber,
            sugar,
            userId: req.user.id
        });

        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update meal
const updateMeal = async (req, res) => {
    try {
        const mealId = req.params.id;
        const {
            name,
            description,
            calories,
            protein,
            carbs,
            fat,
            micronutrients,
            vitamins,
            minerals,
            glycemicIndex,
            glycemicLoad,
            waterContent,
            omega3,
            omega6,
            polyphenols,
            antioxidants,
            solubleFiber,
            insolubleFiber,
            sodium,
            cholesterol,
            fiber,
            sugar
        } = req.body;

        if (!validateUUID(mealId)) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        const meal = await Meal.findByPk(mealId);
        if (!meal || meal.userId !== req.user.id) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        meal.name = name || meal.name;
        meal.description = description || meal.description;
        meal.calories = calories || meal.calories;
        meal.protein = protein || meal.protein;
        meal.carbs = carbs || meal.carbs;
        meal.fat = fat || meal.fat;
        meal.micronutrients = micronutrients || meal.micronutrients;
        meal.vitamins = vitamins || meal.vitamins;
        meal.minerals = minerals || meal.minerals;
        meal.glycemicIndex = glycemicIndex || meal.glycemicIndex;
        meal.glycemicLoad = glycemicLoad || meal.glycemicLoad;
        meal.waterContent = waterContent || meal.waterContent;
        meal.omega3 = omega3 || meal.omega3;
        meal.omega6 = omega6 || meal.omega6;
        meal.polyphenols = polyphenols || meal.polyphenols;
        meal.antioxidants = antioxidants || meal.antioxidants;
        meal.solubleFiber = solubleFiber || meal.solubleFiber;
        meal.insolubleFiber = insolubleFiber || meal.insolubleFiber;
        meal.sodium = sodium || meal.sodium;
        meal.cholesterol = cholesterol || meal.cholesterol;
        meal.fiber = fiber || meal.fiber;
        meal.sugar = sugar || meal.sugar;

        await meal.save();
        res.status(200).json(meal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete meal
const deleteMeal = async (req, res) => {
    try {
        const mealId = req.params.id;
        if (!validateUUID(mealId)) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        const meal = await Meal.findByPk(mealId);
        if (!meal || meal.userId !== req.user.id) {
            return res.status(404).json({ message: 'Meal not found' });
        }
        await meal.destroy();
        res.status(200).json({ message: 'Meal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Log a new meal with detailed nutrition info
const logMeal = async (req, res) => {
    try {
        const {
            name,
            calories,
            protein,
            carbs,
            fat,
            micronutrients,
            vitamins,
            minerals,
            glycemicIndex,
            glycemicLoad,
            waterContent,
            omega3,
            omega6,
            polyphenols,
            antioxidants,
            solubleFiber,
            insolubleFiber,
            sodium,
            cholesterol,
            fiber,
            sugar
        } = req.body;

        if (!name || !calories || !protein || !carbs || !fat) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const meal = await Meal.create({
            name,
            calories,
            protein,
            carbs,
            fat,
            micronutrients,
            vitamins,
            minerals,
            glycemicIndex,
            glycemicLoad,
            waterContent,
            omega3,
            omega6,
            polyphenols,
            antioxidants,
            solubleFiber,
            insolubleFiber,
            sodium,
            cholesterol,
            fiber,
            sugar,
            userId: req.user.id
        });

        res.status(201).json(meal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export all the defined functions
module.exports = {
    getMeals,
    getMeal,
    createMeal,
    updateMeal,
    deleteMeal,
    logMeal
};
