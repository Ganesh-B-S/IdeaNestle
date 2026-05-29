const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOTP = require("../services/emailService");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔹 REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const [existing] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      `INSERT INTO users (name, email, password, otp, is_verified, auth_provider)
       VALUES (?, ?, ?, ?, false, 'email')`,
      [name, email, hashedPassword, otp]
    );

    await sendOTP(email, otp);

    res.json({
      success: true,
      message: "OTP sent",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [results] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await db.promise().query(
      "UPDATE users SET is_verified = true, otp = NULL WHERE email = ?",
      [email]
    );

    res.json({
      success: true,
      message: "Verified successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    const [results] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    let user;

    if (results.length === 0) {
      const [insertResult] = await db.promise().query(
        `INSERT INTO users (name, email, is_verified, auth_provider)
         VALUES (?, ?, true, 'google')`,
        [name, email]
      );

      user = { id: insertResult.insertId, email };
    } else {
      user = results[0];
    }

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token: jwtToken });

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};