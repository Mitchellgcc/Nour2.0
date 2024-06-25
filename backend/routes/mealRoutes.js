// backend/routes/mealRoutes.js

const express = require('express');
const { getMeals, getMeal, createMeal, updateMeal, deleteMeal, logMeal } = require('../controllers/mealController');
const { handleMealUpload } = require('../controllers/mealUploadController'); 
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getMeals);
router.get('/:id', authMiddleware, getMeal);
router.post('/', authMiddleware, createMeal);
router.put('/:id', authMiddleware, updateMeal);
router.delete('/:id', authMiddleware, deleteMeal);
router.post('/upload', authMiddleware, handleMealUpload);
router.post('/log', authMiddleware, logMeal);

module.exports = router;
