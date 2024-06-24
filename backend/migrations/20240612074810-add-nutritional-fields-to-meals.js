'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Meals', 'nutrientDensityScore', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'healthImpactScore', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'inflammationScore', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'oxidativeStressScore', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'microbiomeImpactScore', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Meals', 'nutrientDensityScore');
    await queryInterface.removeColumn('Meals', 'healthImpactScore');
    await queryInterface.removeColumn('Meals', 'inflammationScore');
    await queryInterface.removeColumn('Meals', 'oxidativeStressScore');
    await queryInterface.removeColumn('Meals', 'microbiomeImpactScore');
  }
};