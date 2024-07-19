// backend/controllers/inventoryController.js
const InventoryItem = require('../models/InventoryItem');

// Get all inventory items
exports.getInventory = async (req, res) => {
  try {
    const items = await InventoryItem.findAll({ where: { userId: req.user.id } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single inventory item
exports.getInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id);
    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new inventory item
exports.createInventoryItem = async (req, res) => {
  try {
    const { name, quantity, expirationDate } = req.body;
    const item = await InventoryItem.create({ name, quantity, expirationDate, userId: req.user.id });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inventory item
exports.updateInventoryItem = async (req, res) => {
  try {
    const { name, quantity, expirationDate } = req.body;
    const item = await InventoryItem.findByPk(req.params.id);
    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    item.name = name || item.name;
    item.quantity = quantity || item.quantity;
    item.expirationDate = expirationDate || item.expirationDate;
    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete inventory item
exports.deleteInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findByPk(req.params.id);
    if (!item || item.userId !== req.user.id) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    await item.destroy();
    res.status(200).json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
