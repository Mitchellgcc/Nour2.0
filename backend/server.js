// backend/server.js

const app = require('./app');
const { sequelize } = require('./config/database');
const dotenv = require('dotenv');
const { syncWhoopDataForAllUsers } = require('./scheduling/scheduler'); // Import the sync function

dotenv.config();

const PORT = process.env.PORT || 5001;

console.log('PostgreSQL URI:', process.env.POSTGRESQL_URI);

sequelize.sync().then(async () => {
  console.log('Sequelize synced successfully');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    require('./scheduling/scheduler'); // Start the scheduler
  });

  await syncWhoopDataForAllUsers(); // Sync Whoop data for all users on startup
}).catch(err => {
  console.error('Error syncing Sequelize:', err);
});

module.exports = app; // Ensure app is exported for tests
