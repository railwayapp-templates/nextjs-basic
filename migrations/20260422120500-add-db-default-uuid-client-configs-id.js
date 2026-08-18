'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryInterface.changeColumn('client_configs', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('client_configs', 'id', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: null,
    });
  },
};
