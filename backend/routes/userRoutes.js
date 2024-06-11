// backend/routes/userRoutes.js

const express = require('express');
const { checkUserToken } = require('../controllers/userController');
const router = express.Router();

router.post('/check-token', checkUserToken);

module.exports = router;
