const crypto = require('crypto');
const axios = require('axios');
const { sequelize } = require('../config/database');
const { initOtpVerificationModel } = require('../models/otp-verification.model');
const { initClientConfigModel } = require('../models/client-config.model');
const { buildOtpEmailHtml, buildForgotPasswordOtpEmailHtml, buildChangeEmailOtpEmailHtml } = require('../templates/otp-email.template');
const { sendOtpEmail } = require('./email.service');
const { decrypt } = require('../utils/encryption.util');

const OtpVerification = initOtpVerificationModel(sequelize);
const ClientConfig = initClientConfigModel(sequelize);

const OTP_EXPIRY_MINUTES = 30;
const OTP_LENGTH = 6;

const normalizeEmail = (email) => email.trim().toLowerCase();

const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

const generateOtp = () => crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');

const getExpiryDate = () => new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

const requestOtp = async ({ email, clientCode, firstName, lastName }) => {
  console.log("email====",email);
    console.log("clientCode====",clientCode);
  console.log("firstName====",firstName);
  console.log("lastName====",lastName);

  const normalizedEmail = normalizeEmail(email);
  const normalizedClientCode = clientCode.trim();

  const clientConfig = await ClientConfig.findOne({
    where: {
      clientCode: normalizedClientCode,
    },
  });

  if (!clientConfig) {
    const error = new Error('Client config not found');
    error.response = {
      status: 404,
      data: {
        message: `No client config found for clientCode: ${normalizedClientCode}`,
      },
    };
    throw error;
  }

  const strapiEndpoint = clientConfig.starpiurl;
  console.log("strapiEndpoint====>>>>",strapiEndpoint);

  if (!strapiEndpoint) {
    const error = new Error('Client strapi url is not configured');
    error.response = { status: 500, data: { message: 'Client strapi url is not configured' } };
    throw error;
  }

  const token = decrypt(clientConfig.strapiAuthToken);

  if (!token) {
    const error = new Error('Client strapi auth token is not configured');
    error.response = { status: 500, data: { message: 'Client strapi auth token is not configured' } };
    throw error;
  }

  const queryParams = new URLSearchParams({ populate: '*' });
  const url = `${strapiEndpoint}api/app-styling-detail/?${queryParams.toString()}`;
  console.log("url====",url);

  const response=await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("response=====>>>>>",response.data.data.logo.formats.large.url);
  const urlv2=response.data.data.logo.formats.large.url

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = getExpiryDate();

  const existingRecord = await OtpVerification.findOne({
    where: {
      email: normalizedEmail,
      clientCode: normalizedClientCode,
    },
  });

  let userRecord;
  if (existingRecord) {
    await existingRecord.update({
      otpHash,
      expiresAt,
      usedAt: null,
      attemptCount: 0,
      firstName,
      lastName,
    });
    userRecord = existingRecord;
  } else {
    userRecord = await OtpVerification.create({
      email: normalizedEmail,
      firstName,
      lastName,
      clientCode: normalizedClientCode,
      otpHash,
      expiresAt,
      isvalidate: false,
    });
  }

  const html = buildOtpEmailHtml({
    otp,
    expiresInMinutes: OTP_EXPIRY_MINUTES,
    urlv2,
    firstName,
  });
  // console.log("html======>>>>>",html);

  await sendOtpEmail({
    to: normalizedEmail,
    subject: 'Your CedoApps verification code',
    html,
  });

  return {
    id: userRecord.id,
    email: userRecord.email,
    firstName: userRecord.firstName,
    lastName: userRecord.lastName,
    clientCode: userRecord.clientCode,
    expiresAt: userRecord.expiresAt,
  };
};

const verifyOtp = async ({ email, clientCode, otp }) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedClientCode = clientCode.trim();
  const normalizedOtp = otp.trim();

  const userRecord = await OtpVerification.findOne({
    where: {
      email: normalizedEmail,
      clientCode: normalizedClientCode,
    },
  });

  if (!userRecord) {
    const error = new Error('No verification code found for this email and client. Please request a new OTP.');
    error.response = { status: 404, data: { message: error.message } };
    throw error;
  }

  // if (userRecord.usedAt || userRecord.isvalidate) {
  //   const error = new Error('This OTP has already been used. Please request a new one.');
  //   error.response = { status: 400, data: { message: error.message } };
  //   throw error;
  // }

  if (new Date() > userRecord.expiresAt) {
    const error = new Error('This OTP has expired. Please request a new one.');
    error.response = { status: 400, data: { message: error.message } };
    throw error;
  }

  const otpHash = hashOtp(normalizedOtp);

  if (otpHash !== userRecord.otpHash) {
    await userRecord.update({
      attemptCount: userRecord.attemptCount + 1,
    });

    const error = new Error('The OTP you entered is incorrect. Please check and try again.');
    error.response = { status: 400, data: { message: error.message } };
    throw error;
  }

  await userRecord.update({
    isvalidate: true,
    usedAt: new Date(),
  });

  return {
    id: userRecord.id,
    email: userRecord.email,
    firstName: userRecord.firstName,
    lastName: userRecord.lastName,
    clientCode: userRecord.clientCode,
    isvalidate: true,
  };
};

const requestPasswordResetOtp = async ({ email, clientCode }) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedClientCode = clientCode.trim();

  const existingRecord = await OtpVerification.findOne({
    where: {
      email: normalizedEmail,
      clientCode: normalizedClientCode,
    },
  });

  if (!existingRecord) {
    const error = new Error('No user found with this email');
    error.response = { status: 404, data: { message: error.message } };
    throw error;
  }

  const clientConfig = await ClientConfig.findOne({
    where: {
      clientCode: normalizedClientCode,
    },
  });

  if (!clientConfig) {
    const error = new Error('Client config not found');
    error.response = {
      status: 404,
      data: {
        message: `No client config found for clientCode: ${normalizedClientCode}`,
      },
    };
    throw error;
  }

  const strapiEndpoint = clientConfig.starpiurl;

  if (!strapiEndpoint) {
    const error = new Error('Client strapi url is not configured');
    error.response = { status: 500, data: { message: 'Client strapi url is not configured' } };
    throw error;
  }

  const token = decrypt(clientConfig.strapiAuthToken);

  if (!token) {
    const error = new Error('Client strapi auth token is not configured');
    error.response = { status: 500, data: { message: 'Client strapi auth token is not configured' } };
    throw error;
  }

  const queryParams = new URLSearchParams({ populate: '*' });
  const url = `${strapiEndpoint}api/app-styling-detail/?${queryParams.toString()}`;

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const urlv2 = response.data.data.logo.formats.large.url;

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = getExpiryDate();

  await existingRecord.update({
    otpHash,
    expiresAt,
    usedAt: null,
    attemptCount: 0,
  });

  const html = buildForgotPasswordOtpEmailHtml({
    otp,
    expiresInMinutes: OTP_EXPIRY_MINUTES,
    urlv2,
    firstName: existingRecord.firstName,
  });

  await sendOtpEmail({
    to: normalizedEmail,
    subject: 'Your CedoApps password reset code',
    html,
  });

  return {
    id: existingRecord.id,
    email: existingRecord.email,
    firstName: existingRecord.firstName,
    lastName: existingRecord.lastName,
    clientCode: existingRecord.clientCode,
    expiresAt: existingRecord.expiresAt,
  };
};

const requestChangeEmailOtp = async ({ clientCode, oldEmail, newEmail }) => {
  const normalizedClientCode = clientCode.trim();
  const normalizedOldEmail = normalizeEmail(oldEmail);
  const normalizedNewEmail = normalizeEmail(newEmail);

  const userRecord = await OtpVerification.findOne({
    where: {
      email: normalizedOldEmail,
      clientCode: normalizedClientCode,
    },
  });

  if (!userRecord) {
    const error = new Error('No user found with this email');
    error.response = { status: 404, data: { message: error.message } };
    throw error;
  }

  const clientConfig = await ClientConfig.findOne({
    where: {
      clientCode: normalizedClientCode,
    },
  });

  if (!clientConfig) {
    const error = new Error('Client config not found');
    error.response = {
      status: 404,
      data: {
        message: `No client config found for clientCode: ${normalizedClientCode}`,
      },
    };
    throw error;
  }

  const strapiEndpoint = clientConfig.starpiurl;

  if (!strapiEndpoint) {
    const error = new Error('Client strapi url is not configured');
    error.response = { status: 500, data: { message: 'Client strapi url is not configured' } };
    throw error;
  }

  const token = decrypt(clientConfig.strapiAuthToken);

  if (!token) {
    const error = new Error('Client strapi auth token is not configured');
    error.response = { status: 500, data: { message: 'Client strapi auth token is not configured' } };
    throw error;
  }

  const queryParams = new URLSearchParams({ populate: '*' });
  const url = `${strapiEndpoint}api/app-styling-detail/?${queryParams.toString()}`;

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const urlv2 = response.data.data.logo.formats.large.url;

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = getExpiryDate();

  await userRecord.update({
    otpHash,
    expiresAt,
    usedAt: null,
    attemptCount: 0,
  });

  const html = buildChangeEmailOtpEmailHtml({
    otp,
    expiresInMinutes: OTP_EXPIRY_MINUTES,
    urlv2,
    firstName: userRecord.firstName,
  });

  await sendOtpEmail({
    to: normalizedOldEmail,
    subject: 'Confirm Your Email Change - CedoApps',
    html,
  });

  return {
    id: userRecord.id,
    oldEmail: userRecord.email,
    newEmail: normalizedNewEmail,
    clientCode: userRecord.clientCode,
    expiresAt: userRecord.expiresAt,
  };
};

const verifyEmailChangeOtp = async ({ clientCode, oldEmail, newEmail, otp }) => {
  const normalizedClientCode = clientCode.trim();
  const normalizedOldEmail = normalizeEmail(oldEmail);
  const normalizedNewEmail = normalizeEmail(newEmail);
  const normalizedOtp = otp.trim();

  const userRecord = await OtpVerification.findOne({
    where: {
      email: normalizedOldEmail,
      clientCode: normalizedClientCode,
    },
  });

  if (!userRecord) {
    const error = new Error('No verification record found for this email and client.');
    error.response = { status: 404, data: { message: error.message } };
    throw error;
  }

  if (new Date() > userRecord.expiresAt) {
    const error = new Error('This OTP has expired. Please request a new one.');
    error.response = { status: 400, data: { message: error.message } };
    throw error;
  }

  const otpHash = hashOtp(normalizedOtp);

  if (otpHash !== userRecord.otpHash) {
    await userRecord.update({
      attemptCount: userRecord.attemptCount + 1,
    });

    const error = new Error('The OTP you entered is incorrect. Please check and try again.');
    error.response = { status: 400, data: { message: error.message } };
    throw error;
  }

  const existingEmailRecord = await OtpVerification.findOne({
    where: {
      email: normalizedNewEmail,
      clientCode: normalizedClientCode,
    },
  });

  if (existingEmailRecord) {
    const error = new Error('This email address is already in use by another user.');
    error.response = { status: 409, data: { message: error.message } };
    throw error;
  }

  await userRecord.update({
    email: normalizedNewEmail,
    isvalidate: true,
    usedAt: new Date(),
  });

  return {
    id: userRecord.id,
    email: userRecord.email,
    firstName: userRecord.firstName,
    lastName: userRecord.lastName,
    clientCode: userRecord.clientCode,
  };
};

module.exports = {
  requestOtp,
  verifyOtp,
  requestPasswordResetOtp,
  requestChangeEmailOtp,
  verifyEmailChangeOtp,
  OTP_EXPIRY_MINUTES,
};
