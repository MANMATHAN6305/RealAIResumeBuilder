import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../index.js";

const router = express.Router();

// ===== SIGNUP =====
router.post("/register", async (req, res) => {
  const { firstName, lastName, dob, dateOfBirth, email, password } = req.body;

  // Accept either dob or dateOfBirth from client
  const normalizedDob = dateOfBirth || dob;

  if (!firstName || !lastName || !normalizedDob || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (map dob to date_of_birth and password to password_hash)
    const [result] = await pool.query(
      "INSERT INTO users (first_name, last_name, date_of_birth, email, password_hash) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, normalizedDob, email, hashedPassword]
    );

    const userId = result.insertId;
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        firstName,
        lastName,
        email,
        dob: normalizedDob,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// ===== LOGIN =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash || user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return basic user info (no password)
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.first_name,
      // Issue JWT token and return basic user info
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || "dev_secret",
        { expiresIn: "7d" }
      );
export default router;
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          dob: user.date_of_birth,
        },
      });