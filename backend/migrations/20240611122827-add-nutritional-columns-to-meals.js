'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Meals', 'protein', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Meals', 'carbs', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Meals', 'fat', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Meals', 'micronutrients', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'vitamins', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'minerals', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'glycemicIndex', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'glycemicLoad', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'waterContent', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'omega3', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'omega6', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'polyphenols', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'antioxidants', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'solubleFiber', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('Meals', 'insolubleFiber', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Meals', 'protein');
    await queryInterface.removeColumn('Meals', 'carbs');
    await queryInterface.removeColumn('Meals', 'fat');
    await queryInterface.removeColumn('Meals', 'micronutrients');
    await queryInterface.removeColumn('Meals', 'vitamins');
    await queryInterface.removeColumn('Meals', 'minerals');
    await queryInterface.removeColumn('Meals', 'glycemicIndex');
    await queryInterface.removeColumn('Meals', 'glycemicLoad');
    await queryInterface.removeColumn('Meals', 'waterContent');
    await queryInterface.removeColumn('Meals', 'omega3');
    await queryInterface.removeColumn('Meals', 'omega6');
    await queryInterface.removeColumn('Meals', 'polyphenols');
    await queryInterface.removeColumn('Meals', 'antioxidants');
    await queryInterface.removeColumn('Meals', 'solubleFiber');
    await queryInterface.removeColumn('Meals', 'insolubleFiber');
  }
};
