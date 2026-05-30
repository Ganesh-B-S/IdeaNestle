const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const auth =
  require("../middleware/authMiddleware");
  // Profile
router.get(
  "/profile",
  auth,
  authController.getProfile
);

router.put(
  "/profile",
  auth,
  authController.updateProfile
);

// Password Reset
router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
  "/reset-password",
  authController.resetPassword
);

const {
  loginLimiter,
  registerLimiter,
  otpLimiter,
} = require("../middleware/rateLimiter");

// Register
router.post(
  "/register",
  registerLimiter,
  authController.register
);

// Verify OTP
router.post(
  "/verify-otp",
  otpLimiter,
  authController.verifyOTP
);

// Resend
router.post(
  "/resend-otp",
  authController.resendOTP
);

// Login
router.post(
  "/login",
  loginLimiter,
  authController.login
);

// Google Login
router.post(
  "/google-login",
  loginLimiter,
  authController.googleLogin
);

module.exports = router;