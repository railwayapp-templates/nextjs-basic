const buildOtpEmailHtml = ({ otp, expiresInMinutes = 30, urlv2, firstName }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification - OTP</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f2f5; font-family:Arial, Helvetica, sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f2f5; padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Email container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; max-width:600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#000000; padding:24px 20px;">
              <img src="${urlv2}" width="260" style="display:block; max-width:260px; height:auto;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <h1 style="margin:0 0 16px 0; font-size:22px; color:#1a1a1a; font-weight:700; text-align:center;">
                Verify Your Email Address
              </h1>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#555555; text-align:center;">
                Hi${firstName ? ` ${firstName}` : ''},<br>
                Thanks for signing up! Please use the One-Time Password (OTP) below to verify your email address. This code is valid for <strong>${expiresInMinutes} minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:10px 0 30px 0;">
                    <div style="display:inline-block; background-color:#f5f5f7; border:1px solid #e0e0e5; border-radius:8px; padding:18px 36px;">
                      <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#1a1a1a; font-family:'Courier New', Courier, monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#777777; text-align:center;">
                If you didn't request this code, you can safely ignore this email.
              </p>

              <p style="margin:0; font-size:14px; line-height:1.6; color:#777777; text-align:center;">
                For your security, never share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none; border-top:1px solid #eaeaea; margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 20px 30px 20px; background-color:#ffffff;">
             <p style="margin:0; font-size:12px; color:#999999;">
                Powered by 
              </p>
              <img src="cid:cedoAppsGray" alt="Cedo Apps" width="120" style="display:block; max-width:120px; height:auto; margin:0 auto 10px auto;">
              <p style="margin:8px 0 0 0; font-size:11px; color:#bbbbbb;">
                &copy; 2026 CedoApps. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Email container -->

      </td>
    </tr>
  </table>

</body>
</html>`;
};

const buildForgotPasswordOtpEmailHtml = ({ otp, expiresInMinutes = 30, urlv2, firstName }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset - OTP</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f2f5; font-family:Arial, Helvetica, sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f2f5; padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Email container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; max-width:600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#000000; padding:24px 20px;">
              <img src="${urlv2}" width="260" style="display:block; max-width:260px; height:auto;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <h1 style="margin:0 0 16px 0; font-size:22px; color:#1a1a1a; font-weight:700; text-align:center;">
                Reset Your Password
              </h1>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#555555; text-align:center;">
                Hi${firstName ? ` ${firstName}` : ''},<br>
                We received a request to reset your password. Please use the One-Time Password (OTP) below to continue. This code is valid for <strong>${expiresInMinutes} minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:10px 0 30px 0;">
                    <div style="display:inline-block; background-color:#f5f5f7; border:1px solid #e0e0e5; border-radius:8px; padding:18px 36px;">
                      <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#1a1a1a; font-family:'Courier New', Courier, monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#777777; text-align:center;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>

              <p style="margin:0; font-size:14px; line-height:1.6; color:#777777; text-align:center;">
                For your security, never share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none; border-top:1px solid #eaeaea; margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 20px 30px 20px; background-color:#ffffff;">
             <p style="margin:0; font-size:12px; color:#999999;">
                Powered by
              </p>
              <img src="cid:cedoAppsGray" alt="Cedo Apps" width="120" style="display:block; max-width:120px; height:auto; margin:0 auto 10px auto;">
              <p style="margin:8px 0 0 0; font-size:11px; color:#bbbbbb;">
                &copy; 2026 CedoApps. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Email container -->

      </td>
    </tr>
  </table>

</body>
</html>`;
};

const buildChangeEmailOtpEmailHtml = ({ otp, expiresInMinutes = 30, urlv2, firstName }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Change Verification - OTP</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f2f5; font-family:Arial, Helvetica, sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f2f5; padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Email container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; max-width:600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#000000; padding:24px 20px;">
              <img src="${urlv2}" width="260" style="display:block; max-width:260px; height:auto;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <h1 style="margin:0 0 16px 0; font-size:22px; color:#1a1a1a; font-weight:700; text-align:center;">
                Confirm Email Change
              </h1>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#555555; text-align:center;">
                Hi${firstName ? ` ${firstName}` : ''},<br>
                We received a request to change your email address. Please use the One-Time Password (OTP) below to verify and confirm this change. This code is valid for <strong>${expiresInMinutes} minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:10px 0 30px 0;">
                    <div style="display:inline-block; background-color:#f5f5f7; border:1px solid #e0e0e5; border-radius:8px; padding:18px 36px;">
                      <span style="font-size:32px; font-weight:700; letter-spacing:8px; color:#1a1a1a; font-family:'Courier New', Courier, monospace;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0; font-size:14px; line-height:1.6; color:#777777; text-align:center;">
                If you didn't request to change your email, you can safely ignore this email. Your account security is important to us.
              </p>

              <p style="margin:0; font-size:14px; line-height:1.6; color:#777777; text-align:center;">
                For your security, never share this code with anyone.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none; border-top:1px solid #eaeaea; margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 20px 30px 20px; background-color:#ffffff;">
             <p style="margin:0; font-size:12px; color:#999999;">
                Powered by
              </p>
              <img src="cid:cedoAppsGray" alt="Cedo Apps" width="120" style="display:block; max-width:120px; height:auto; margin:0 auto 10px auto;">
              <p style="margin:8px 0 0 0; font-size:11px; color:#bbbbbb;">
                &copy; 2026 CedoApps. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Email container -->

      </td>
    </tr>
  </table>

</body>
</html>`;
};

module.exports = {
  buildOtpEmailHtml,
  buildForgotPasswordOtpEmailHtml,
  buildChangeEmailOtpEmailHtml,
};
