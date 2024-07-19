const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
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
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timeZone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notifications: {
    type: DataTypes.JSON,
    allowNull: true,
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
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bodyComposition: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  activityLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dietHistory: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  healthMetricsTrends: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  realTimeData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'Users'
});

module.exports = User;
