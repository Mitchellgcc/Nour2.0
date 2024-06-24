// backend/models/User.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  whoopId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  whoopAccessToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  whoopRefreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  whoopTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dietaryPreferences: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  feedback: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  overallHealthScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  healthTrend: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'Users'
});

module.exports = User;
