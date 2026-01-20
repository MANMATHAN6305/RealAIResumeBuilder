import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ===== MySQL Pool (VALID options only) =====
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "resume_builder",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

export { pool };

// ===== Start Server =====
const port = Number(process.env.PORT || 3001);

const server = app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 Database: ${process.env.DB_NAME || "resume_builder"}`);
  console.log(
    `🌐 CORS enabled for: ${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }`
  );

  if (!process.env.GOOGLE_CLIENT_ID) {
    console.log("⚠️  Google OAuth not configured - email/password only");
  }
});

// ===== Explicit port error handling =====
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `❌ Port ${port} is already in use.\n` +
      `➡ Stop the other process or set a different PORT in .env`
    );
    process.exit(1);
  }
  throw err;
});
