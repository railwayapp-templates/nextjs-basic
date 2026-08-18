'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryInterface.createTable('otp_verifications', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      clientCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      otpHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      usedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      attemptCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('otp_verifications', ['email', 'clientCode'], {
      name: 'otp_verifications_email_client_code_idx',
    });

    await queryInterface.addIndex('otp_verifications', ['expiresAt'], {
      name: 'otp_verifications_expires_at_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('otp_verifications');
  },
};
