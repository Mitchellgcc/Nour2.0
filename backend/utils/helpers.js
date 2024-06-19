// utils/helpers.js

const handleErrors = (res, error, message) => {
    console.error(`[${new Date().toISOString()}] ${message}:`, error.message);
    res.status(500).json({ message, error: error.message });
};

const logAction = (message) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};

const categorizeItems = (items) => {
    return items.map(item => ({ ...item, category: 'uncategorized' }));
};

const convertUnitsToUK = (items) => {
    return items.map(item => {
        if (item.unit === 'oz') {
            item.unit = 'g';
            item.quantity = item.quantity * 28.3495;
        }
        // Add more conversions here
        return item;
    });
};

// Enhanced validation function to check for proper structure and data types
const validateData = (data) => {
    if (!data || typeof data !== 'object' || !Array.isArray(data.items)) {
        console.error('Validation failed: data is not an object or items is not an array');
        return false;
    }
    for (const item of data.items) {
        if (typeof item.name !== 'string' || typeof item.quantity !== 'number') {
            console.error(`Validation failed: item is missing name or quantity - ${JSON.stringify(item)}`);
            return false;
        }
        if (!item.unit || typeof item.unit !== 'string') {
            console.error(`Validation failed: item is missing unit - ${JSON.stringify(item)}`);
            return false;
        }
        // Additional checks can be added here
    }
    return true;
};

module.exports = {
    validateData,
    handleErrors,
    logAction,
    categorizeItems,
    convertUnitsToUK
};
