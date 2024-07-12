// backend/migrations/<timestamp>-add-profile-fields-to-users.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('Users');

    if (!tableDefinition.dateOfBirth) {
      await queryInterface.addColumn('Users', 'dateOfBirth', {
        type: Sequelize.DATE,
        allowNull: false,
      });
    }

    if (!tableDefinition.height) {
      await queryInterface.addColumn('Users', 'height', {
        type: Sequelize.FLOAT,
        allowNull: false,
      });
    }

    if (!tableDefinition.weight) {
      await queryInterface.addColumn('Users', 'weight', {
        type: Sequelize.FLOAT,
        allowNull: false,
      });
    }

    if (!tableDefinition.gender) {
      await queryInterface.addColumn('Users', 'gender', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('Users');

    if (tableDefinition.dateOfBirth) {
      await queryInterface.removeColumn('Users', 'dateOfBirth');
    }

    if (tableDefinition.height) {
      await queryInterface.removeColumn('Users', 'height');
    }

    if (tableDefinition.weight) {
      await queryInterface.removeColumn('Users', 'weight');
    }

    if (tableDefinition.gender) {
      await queryInterface.removeColumn('Users', 'gender');
    }
  }
};
