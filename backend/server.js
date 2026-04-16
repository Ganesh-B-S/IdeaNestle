const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./authMiddleware");
const sendOTP = require("./emailService");
const app = express();

// ✅ MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ✅ PROTECTED ROUTE
app.get("/api/profile", auth, (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user,
  });
});

// ✅ REGISTER
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO users (name, email, password, otp, is_verified)
    VALUES (?, ?, ?, ?, false)
  `;

  db.query(sql, [name, email, hashedPassword, otp], async (err) => {
    if (err) {
      return res.status(400).json({ message: "User already exists" });
    }

    await sendOTP(email, otp);

    res.json({ message: "OTP sent to email" });
  });
});

// ✅ VERIFY_OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    const user = results[0];

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const updateSql = `
      UPDATE users SET is_verified = true, otp = NULL WHERE email = ?
    `;

    db.query(updateSql, [email]);

    res.json({ message: "Account verified successfully" });
  });
});


// ✅ LOGIN
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const user = results[0]; // ✅ DEFINE user HERE

    // ✅ NOW safe to check
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({ token });
  });
});

// ✅ START SERVER AT THE END
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
