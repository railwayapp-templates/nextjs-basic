const express = require('express');
const { sendOtp, validateOtp, forgotPasswordOtp, changeEmailOtp, verifyEmailChange } = require('../controllers/otp.controller');

const router = express.Router();

router.post('/request', sendOtp);
router.post('/verify', validateOtp);
router.post('/forgot-password-otp', forgotPasswordOtp);
router.post('/change-email', changeEmailOtp);
router.post('/verify-email-change', verifyEmailChange);

module.exports = router;
