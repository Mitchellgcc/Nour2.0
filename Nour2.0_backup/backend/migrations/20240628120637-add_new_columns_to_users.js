'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'dietHistory', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'healthMetricsTrends', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'realTimeData', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'dietHistory');
    await queryInterface.removeColumn('Users', 'healthMetricsTrends');
    await queryInterface.removeColumn('Users', 'realTimeData');
  }
};
