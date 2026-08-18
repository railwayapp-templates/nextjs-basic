const { DataTypes, Model } = require('sequelize');

class OtpVerification extends Model {}

const initOtpVerificationModel = (sequelize) => {
  OtpVerification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clientCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otpHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      attemptCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isvalidate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'OtpVerification',
      tableName: 'user',
      timestamps: true,
    }
  );

  return OtpVerification;
};

module.exports = {
  OtpVerification,
  initOtpVerificationModel,
};
