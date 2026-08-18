'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('otp_verifications', 'user');

    await queryInterface.addColumn('user', 'isvalidate', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user', 'isvalidate');

    await queryInterface.renameTable('user', 'otp_verifications');
  },
};
