// backend/routes/inventoryRoutes.js
const express = require('express');
const { getInventory, getInventoryItem, createInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getInventory);
router.get('/:id', authMiddleware, getInventoryItem);
router.post('/', authMiddleware, createInventoryItem);
router.put('/:id', authMiddleware, updateInventoryItem);
router.delete('/:id', authMiddleware, deleteInventoryItem);

module.exports = router;
