const User = require('./User');
const Meal = require('./Meal');
const NutritionalData = require('./NutritionalData');
const UserPreferences = require('./UserPreferences');
const Notification = require('./Notification');
const InventoryItem = require('./InventoryItem');
const UserFeedback = require('./UserFeedback');
const WhoopData = require('./WhoopData');
const EnhancedData = require('./EnhancedData');

User.hasMany(Meal, { foreignKey: 'userId' });
Meal.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(NutritionalData, { foreignKey: 'userId' });
NutritionalData.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(UserPreferences, { foreignKey: 'userId' });
UserPreferences.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(InventoryItem, { foreignKey: 'userId' });
InventoryItem.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(UserFeedback, { foreignKey: 'userId' });
UserFeedback.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(WhoopData, { foreignKey: 'userId' });
WhoopData.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(EnhancedData, { foreignKey: 'userId' });
EnhancedData.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Meal,
  NutritionalData,
  UserPreferences,
  Notification,
  InventoryItem,
  UserFeedback,
  WhoopData,
  EnhancedData,
};
