require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const auth = require("./middleware/authMiddleware");

const app = express();

// ✅ MIDDLEWARE
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ✅ PROTECTED ROUTE
app.get("/api/profile", auth, (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user,
  });
});

// ✅ AUTH ROUTES (ALL LOGIC MOVED HERE)
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "IdeaNestle API is running",
  });
});

app.use("/api", authRoutes);

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});