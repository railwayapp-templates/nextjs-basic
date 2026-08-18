'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('user', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user', 'firstName');
    await queryInterface.removeColumn('user', 'lastName');
  },
};
