const NourScoreService = require('../services/NourScoreService');
const User = require('../models/User');

const calculateNourScore = async (req, res) => {
    try {
        console.log("Request received for calculateNourScore:", req.user);
        const userId = req.user.id;

        const user = await User.findOne({ where: { id: userId } });

        console.log("Fetched user data:", user);

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        const missingFields = [];
        if (!user.weight) missingFields.push('weight');
        if (!user.height) missingFields.push('height');
        if (!user.dateOfBirth) missingFields.push('dateOfBirth');
        if (!user.gender) missingFields.push('gender');
        if (!user.activityLevel) missingFields.push('activityLevel');

        if (missingFields.length > 0) {
            console.log(`Missing user data: ${missingFields.join(', ')}`);
            return res.status(400).json({ error: `Missing user data: ${missingFields.join(', ')}` });
        }

        const { nourScore, individualMetrics } = await NourScoreService.calculateNourScoreForUser(user);
        
        if (!nourScore || !individualMetrics) {
            console.log("No data available for NourScore calculation");
            return res.status(204).json({ message: "No data available for NourScore calculation" });
        }

        console.log("NourScore calculated:", nourScore);
        res.status(200).json({ nourScore, individualMetrics });
    } catch (error) {
        console.error('Error calculating NourScore:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getAggregatedData = async (req, res) => {
    try {
        console.log("Request received for getAggregatedData:", req.user);
        const userId = req.user.id;
        const data = await NourScoreService.getAggregatedDataForUser(userId);
        console.log("Aggregated data fetched:", data);
        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching aggregated data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getNutritionalData = async (req, res) => {
    try {
        console.log("Request received for getNutritionalData:", req.user);
        const userId = req.user.id;
        const data = await NourScoreService.getNutritionalDataForUser(userId);
        console.log("Nutritional data fetched:", data);
        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching nutritional data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { calculateNourScore, getAggregatedData, getNutritionalData };
