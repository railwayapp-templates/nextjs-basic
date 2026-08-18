'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('user', 'isValidated');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'isValidated', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
};
