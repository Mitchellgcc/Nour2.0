// backend/config/database.js
const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Ensure this is at the top before accessing environment variables

const sequelize = new Sequelize(process.env.POSTGRESQL_URI, {
  dialect: 'postgres',
  logging: console.log, // Enable logging
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = { sequelize, mongoose };