const express = require('express');
const path = require('path');
const app = require('./app');
const { sequelize } = require('./config/database');
const dotenv = require('dotenv');
const { syncWhoopDataForAllUsers } = require('./scheduling/scheduler');

dotenv.config();

const PORT = process.env.PORT || 5001;

console.log('PostgreSQL URI:', process.env.POSTGRESQL_URI);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

sequelize.sync().then(async () => {
  console.log('Sequelize synced successfully');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    require('./scheduling/scheduler');
  });

  await syncWhoopDataForAllUsers();
}).catch(err => {
  console.error('Error syncing Sequelize:', err);
});

module.exports = app;
