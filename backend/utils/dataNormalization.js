// backend/utils/dataNormalization.js

// Function to normalize date and time formats
function normalizeData(data) {
    return data.map(record => {
      if (record.created_at) {
        record.created_at = new Date(record.created_at).toISOString();
      }
      if (record.updated_at) {
        record.updated_at = new Date(record.updated_at).toISOString();
      }
      if (record.start) {
        record.start = new Date(record.start).toISOString();
      }
      if (record.end) {
        record.end = record.end ? new Date(record.end).toISOString() : null;
      }
      return record;
    });
  }
  
  // Function to clean data
  function cleanData(data) {
    return data.filter(record => record != null);
  }
  
  module.exports = {
    normalizeData,
    cleanData
  };
  