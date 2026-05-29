require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const auth = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.set("trust proxy", 1);
// ================= CORS =================
const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ================= BODY PARSER =================
app.use(express.json());

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// ================= API STATUS =================
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "IdeaNestle API is running",
  });
});

// ================= AUTH ROUTES =================
app.use("/api", authRoutes);

// ================= PROTECTED ROUTE =================
app.get("/api/profile", auth, (req, res) => {
  res.json({
    success: true,
    message: "Protected data",
    user: req.user,
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use(errorHandler);

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 IdeaNestle Backend running on port ${PORT}`
  );
});