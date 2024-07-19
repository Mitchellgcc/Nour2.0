// backend/utils/dataNormalization.js

// Function to normalize date and time formats
function normalizeData(data) {
  return data.map(record => {
    try {
      if (record.created_at) {
        const createdAtDate = new Date(record.created_at);
        if (!isNaN(createdAtDate)) {
          record.created_at = createdAtDate.toISOString();
        }
      }
      if (record.updated_at) {
        const updatedAtDate = new Date(record.updated_at);
        if (!isNaN(updatedAtDate)) {
          record.updated_at = updatedAtDate.toISOString();
        }
      }
      if (record.start) {
        const startDate = new Date(record.start);
        if (!isNaN(startDate)) {
          record.start = startDate.toISOString();
        }
      }
      if (record.end) {
        const endDate = record.end ? new Date(record.end) : null;
        if (endDate && !isNaN(endDate)) {
          record.end = endDate.toISOString();
        } else {
          record.end = null;
        }
      }
    } catch (error) {
      console.warn(`Invalid date value encountered in record: ${JSON.stringify(record)}`, error);
    }
    return record;
  });
}

// Function to clean data
function cleanData(data) {
  return data.filter(record => record != null && typeof record === 'object');
}

module.exports = {
  normalizeData,
  cleanData
};
