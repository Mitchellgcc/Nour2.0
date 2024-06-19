const express = require('express');
const { handleInventoryUpload } = require('../controllers/inventoryUploadController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for handling inventory uploads
router.post('/upload', authMiddleware, handleInventoryUpload);

module.exports = router;
