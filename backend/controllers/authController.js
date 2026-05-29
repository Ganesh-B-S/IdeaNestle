const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendOTP,
  sendResetOTP,
} = require("../services/emailService");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= GET PROFILE =================

exports.getProfile = async (req, res, next) => {
  try {
    const [users] = await db.query(
      `SELECT id, name, email, auth_provider
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(users[0]);
  } catch (error) {
    next(error);
  }
};

// ================= UPDATE PROFILE =================

exports.updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    await db.query(
      `UPDATE users
       SET name = ?
       WHERE id = ?`,
      [name.trim(), req.user.id]
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ================= FORGOT PASSWORD =================

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetOTP = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const resetExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await db.query(
      `UPDATE users
       SET reset_otp = ?,
           reset_otp_expiry = ?
       WHERE email = ?`,
      [resetOTP, resetExpiry, email]
    );

    await sendResetOTP(email, resetOTP);

    res.json({
      success: true,
      message: "Reset OTP sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ================= RESET PASSWORD =================

exports.resetPassword = async (req, res, next) => {
  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = users[0];

    if (
      !user.reset_otp_expiry ||
      new Date() >
        new Date(user.reset_otp_expiry)
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (user.reset_otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users
       SET password = ?,
           reset_otp = NULL,
           reset_otp_expiry = NULL
       WHERE email = ?`,
      [hashedPassword, email]
    );

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

// ================= REGISTER =================
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const otpExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    ); // 5 minutes

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users
      (name, email, password, otp, otp_expiry)
      VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, otp, otpExpiry]
    );

    await sendOTP(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    next(error);
  }
};

// ================= VERIFY OTP =================
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = results[0];

    // Check expiry first
    if (
      !user.otp_expiry ||
      new Date() > new Date(user.otp_expiry)
    ) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await db.query(
      `UPDATE users
       SET is_verified = 1,
           otp = NULL,
           otp_expiry = NULL
       WHERE email = ?`,
      [email]
    );

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    next(error);
  }
};

// ================= LOGIN =================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = results[0];

    if (user.auth_provider === "google") {
      return res.status(400).json({
        message: "Please login with Google",
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    next(error);
  }
};

// ================= GOOGLE LOGIN =================
exports.googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    let user;

    if (results.length === 0) {
      const [insertResult] = await db.query(
        `INSERT INTO users
        (name, email, is_verified, auth_provider)
        VALUES (?, ?, 1, 'google')`,
        [name, email]
      );

      user = {
        id: insertResult.insertId,
        email,
        name,
      };
    } else {
      user = results[0];
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
      next(error);
  }
};