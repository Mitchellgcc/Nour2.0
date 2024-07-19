const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');
const WhoopData = require('../models/WhoopData');

router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        // console.log("Dashboard route accessed");
        // console.log("Authenticated user ID:", req.user.id);
        
        const user = await User.findByPk(req.user.id);
        if (!user) {
            // console.log("User not found");
            return res.status(404).send('User not found');
        }
        
        // console.log("User found:", user);

        const whoopData = await WhoopData.findOne({ where: { userId: user.id } });
        if (!whoopData) {
            // console.log("Whoop data not found for user ID:", user.id);
            return res.status(404).send('Whoop data not found');
        }
        
        // console.log("Whoop data found:", whoopData);

        res.json({ message: `Welcome to your dashboard, ${user.email}`, whoopData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('An error occurred');
    }
});

module.exports = router;