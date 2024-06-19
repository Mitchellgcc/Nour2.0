// backend/utils/scheduler.js
const cron = require('node-cron');
const InventoryItem = require('../models/InventoryItem');

cron.schedule('0 0 * * *', async () => { // Run daily at midnight
  const today = new Date();
  const expiredItems = await InventoryItem.destroy({
    where: {
      expirationDate: {
        [Op.lt]: today,
      }
    }
  });
  console.log(`Removed ${expiredItems} expired items.`);
});
