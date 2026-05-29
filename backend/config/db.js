const mysql = require("mysql2");

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false,
  },
});

// Test DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ Azure MySQL Connected");
    connection.release();
  }
});

module.exports = db.promise();