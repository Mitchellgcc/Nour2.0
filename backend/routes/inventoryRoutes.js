// backend/routes/inventoryRoutes.js

const express = require('express');
const { getInventory, getInventoryItem, createInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const { handleInventoryUpload } = require('../controllers/inventoryUploadController'); 
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create new inventory item
router.post('/', authMiddleware, createInventoryItem);

// Get all inventory items
router.get('/', authMiddleware, getInventory);

// Get single inventory item
router.get('/:id', authMiddleware, getInventoryItem);

// Update inventory item
router.put('/:id', authMiddleware, updateInventoryItem);

// Delete inventory item
router.delete('/:id', authMiddleware, deleteInventoryItem);

// Upload inventory data
router.post('/upload', authMiddleware, handleInventoryUpload);

module.exports = router;
