const { requestOtp, verifyOtp, requestPasswordResetOtp, requestChangeEmailOtp, verifyEmailChangeOtp } = require('../services/otp.service');

const sendOtp = async (req, res) => {
  try {
    const { email, clientCode, firstName, lastName } = req.body;
    

    if (!email || !clientCode) {
      return res.status(400).json({
        message: 'email and clientCode are required',
      });
    }

    const result = await requestOtp({ email, clientCode, firstName, lastName });

    return res.status(200).json({
      message: 'OTP sent successfully',
      data: {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        clientCode: result.clientCode,
        expiresAt: result.expiresAt,
      },
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(statusCode).json({
      message: 'Failed to send OTP',
      details,
    });
  }
};

const validateOtp = async (req, res) => {
  try {
    const { email, clientCode, otp } = req.body;

    if (!email || !clientCode || !otp) {
      return res.status(400).json({
        message: 'email, clientCode and otp are required',
      });
    }

    const result = await verifyOtp({ email, clientCode, otp });

    return res.status(200).json({
      message: 'OTP verified successfully',
      data: {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        clientCode: result.clientCode,
        isvalidate: result.isvalidate,
      },
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(statusCode).json({
      message: typeof details === 'object' && details.message ? details.message : 'Failed to verify OTP',
      details,
    });
  }
};

const forgotPasswordOtp = async (req, res) => {
  try {
    const { email, clientCode } = req.body;

    if (!email || !clientCode) {
      return res.status(400).json({
        message: 'email and clientCode are required',
      });
    }

    const result = await requestPasswordResetOtp({ email, clientCode });

    return res.status(200).json({
      message: 'OTP sent successfully',
      data: {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        clientCode: result.clientCode,
        expiresAt: result.expiresAt,
      },
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(statusCode).json({
      message: typeof details === 'object' && details.message ? details.message : 'Failed to send OTP',
      details,
    });
  }
};

const changeEmailOtp = async (req, res) => {
  try {
    const { clientCode, oldEmail, newEmail } = req.body;

    if (!clientCode || !oldEmail || !newEmail) {
      return res.status(400).json({
        message: 'clientCode, oldEmail and newEmail are required',
      });
    }

    const result = await requestChangeEmailOtp({ clientCode, oldEmail, newEmail });

    return res.status(200).json({
      message: 'Email change confirmation sent successfully',
      data: {
        id: result.id,
        oldEmail: result.oldEmail,
        newEmail: result.newEmail,
        clientCode: result.clientCode,
        expiresAt: result.expiresAt,
      },
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(statusCode).json({
      message: typeof details === 'object' && details.message ? details.message : 'Failed to send email change confirmation',
      details,
    });
  }
};

const verifyEmailChange = async (req, res) => {
  try {
    const { clientCode, oldEmail, newEmail, otp } = req.body;

    if (!clientCode || !oldEmail || !newEmail || !otp) {
      return res.status(400).json({
        message: 'clientCode, oldEmail, newEmail and otp are required',
      });
    }

    const result = await verifyEmailChangeOtp({ clientCode, oldEmail, newEmail, otp });

    return res.status(200).json({
      message: 'Email changed successfully',
      data: {
        id: result.id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        clientCode: result.clientCode,
      },
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const details = error.response?.data || error.message;

    return res.status(statusCode).json({
      message: typeof details === 'object' && details.message ? details.message : 'Failed to verify and change email',
      details,
    });
  }
};

module.exports = {
  sendOtp,
  validateOtp,
  forgotPasswordOtp,
  changeEmailOtp,
  verifyEmailChange,
};
