import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ===== DEBUGGING: Check if .env is loading =====
console.log("--- DEBUG INFO ---");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT (from env):", process.env.DB_PORT);
console.log("------------------");

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));

// ===== MySQL Pool =====
// NOTE: I changed the fallback port to 3307 to match your XAMPP settings
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ai_resume_builder",
  port: Number(process.env.DB_PORT) || 3307, // <--- CHANGED TO 3307
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

// ===== TEST DB CONNECTION =====
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Database connected successfully");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// ===== ROOT ROUTE =====
app.get("/", (req, res) => {
  res.send("✅ Resume Builder Backend is running!");
});

// ===== USE AUTH ROUTES =====
app.use("/api/auth", authRoutes);

// ===== Start Server =====
const port = Number(process.env.PORT || 5000);

const server = app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 Database: ${process.env.DB_NAME || "ai_resume_builder"}`);
});

export { pool };