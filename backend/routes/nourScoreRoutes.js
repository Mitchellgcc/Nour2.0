// backend/routes/nourScoreRoutes.js

const express = require('express');
const { calculateNourScore, getAggregatedData, getNutritionalData } = require('../controllers/NourScoreController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/calculate', authMiddleware, calculateNourScore);
router.get('/data', authMiddleware, getNutritionalData);
router.get('/aggregated', authMiddleware, getAggregatedData);

module.exports = router;
