'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('client_configs', 'chatApiKey', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.changeColumn('client_configs', 'chatApiKeySecret', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.changeColumn('client_configs', 'strapiAuthToken', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('client_configs', 'chatApiKey', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('client_configs', 'chatApiKeySecret', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('client_configs', 'strapiAuthToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
