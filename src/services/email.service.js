const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

const footerLogoPath = path.resolve(__dirname, '../../public/images/cedoAppsGray.png');

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  return new Resend(apiKey);
};

const sendOtpEmail = async ({ to, subject, html }) => {
  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error('RESEND_FROM_EMAIL is not configured');
  }

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
    attachments: [
      {
        filename: 'cedoAppsGray.png',
        content: fs.readFileSync(footerLogoPath),
        contentType: 'image/png',
        contentId: 'cedoAppsGray',
      },
    ],
  });

  if (error) {
    const emailError = new Error(error.message || 'Failed to send OTP email');
    emailError.response = {
      status: 502,
      data: error,
    };
    throw emailError;
  }

  return data;
};

module.exports = {
  sendOtpEmail,
};
