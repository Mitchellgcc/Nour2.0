// backend/migrations/20240612074810-add-nutritional-fields-to-meals.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Meals', 'aminoAcids', { type: Sequelize.JSON });
    await queryInterface.addColumn('Meals', 'fattyAcids', { type: Sequelize.JSON });
    await queryInterface.addColumn('Meals', 'nutrientDensityScore', { type: Sequelize.FLOAT });
    await queryInterface.addColumn('Meals', 'healthImpactScore', { type: Sequelize.FLOAT });
    await queryInterface.addColumn('Meals', 'inflammationScore', { type: Sequelize.FLOAT });
    await queryInterface.addColumn('Meals', 'oxidativeStressScore', { type: Sequelize.FLOAT });
    await queryInterface.addColumn('Meals', 'microbiomeImpactScore', { type: Sequelize.FLOAT });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Meals', 'aminoAcids');
    await queryInterface.removeColumn('Meals', 'fattyAcids');
    await queryInterface.removeColumn('Meals', 'nutrientDensityScore');
    await queryInterface.removeColumn('Meals', 'healthImpactScore');
    await queryInterface.removeColumn('Meals', 'inflammationScore');
    await queryInterface.removeColumn('Meals', 'oxidativeStressScore');
    await queryInterface.removeColumn('Meals', 'microbiomeImpactScore');
  }
};