import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/* ==================== MIDDLEWARE ==================== */
// CORS configuration - allow frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

/* ==================== DATABASE ==================== */
// Handle empty password string properly
const dbPassword = process.env.DB_PASSWORD === "" ? "" : (process.env.DB_PASSWORD || "");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: dbPassword,
  database: process.env.DB_NAME || "resume_builder",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Additional options for better connection handling
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('\n📋 Troubleshooting Steps:');
    console.error('1. Check MySQL is running: Get-Service "*mysql*"');
    console.error('2. Verify database credentials in backend/.env file');
    console.error('3. Ensure database "resume_builder" exists');
    console.error('4. Run: mysql -u root -p < mysql-schema.sql');
    console.error('5. Test connection: mysql -u root -p');
    console.error('\n💡 Common Issues:');
    console.error('   - Empty DB_PASSWORD: Set your MySQL password in .env');
    console.error('   - Wrong password: Update DB_PASSWORD in .env');
    console.error('   - Database not found: Run mysql-schema.sql');
    console.error('   - MySQL not running: Start MySQL service');
    console.error('\nSee DATABASE_FIX.md for detailed instructions\n');
  });

/* ==================== AUTH CONFIG ==================== */
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID
  ? new OAuth2Client(GOOGLE_CLIENT_ID)
  : null;

/* ==================== JWT MIDDLEWARE ==================== */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

/* ==================== AUTH ROUTES ==================== */

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    if (!firstName || !lastName || !email || !password || !dateOfBirth)
      return res.status(400).json({ error: "All fields required" });

    if (password.length < 8)
      return res.status(400).json({ error: "Password min 8 chars" });

    const normalizedEmail = email.toLowerCase().trim();

    const [exists] = await pool.execute(
      "SELECT id FROM users WHERE LOWER(email) = ?",
      [normalizedEmail]
    );
    if (exists.length)
      return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users 
      (first_name, last_name, email, password_hash, date_of_birth, auth_provider)
      VALUES (?, ?, ?, ?, ?, 'local')`,
      [firstName, lastName, normalizedEmail, passwordHash, dateOfBirth]
    );

    const token = jwt.sign(
      { userId: result.insertId, email: normalizedEmail },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ message: "User created", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const [users] = await pool.execute(
      `SELECT * FROM users 
       WHERE LOWER(email) = ? AND (auth_provider = 'local' OR auth_provider IS NULL)`,
      [normalizedEmail]
    );

    if (!users.length) {
      console.log(`Login failed: User not found for email: ${normalizedEmail}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Check if user has a password (for local auth)
    if (!user.password_hash && !user.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Support both password_hash and password field names
    const passwordField = user.password_hash || user.password;
    const valid = await bcrypt.compare(password, passwordField);
    if (!valid) {
      console.log(`Login failed: Invalid password for email: ${normalizedEmail}`);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log(`Login successful for user: ${user.email} (ID: ${user.id})`);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GOOGLE LOGIN (Optional - only works if GOOGLE_CLIENT_ID is configured)
app.post("/api/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    
    // Check if Google OAuth is configured
    if (!GOOGLE_CLIENT_ID || !googleClient) {
      return res.status(400).json({ 
        error: "Google authentication is not configured. Please use email/password login." 
      });
    }

    if (!token) {
      return res.status(400).json({ error: "Google token is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    const [users] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length) {
      const user = users[0];
      const jwtToken = jwt.sign(
        { userId: user.id, email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return res.json({ 
        message: "Login successful",
        token: jwtToken, 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        }
      });
    }

    res.status(202).json({
      requiresCompletion: true,
      email,
      firstName: payload.given_name || '',
      lastName: payload.family_name || ''
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: "Google login failed. Please use email/password login." });
  }
});

/* ==================== RESUME ROUTES ==================== */

app.get("/api/resume", authenticateToken, async (req, res) => {
  const [rows] = await pool.execute(
    "SELECT * FROM resumes WHERE user_id = ?",
    [req.userId]
  );
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

/* ==================== HEALTH ==================== */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

/* ==================== SERVE FRONTEND (Production Only) ==================== */
// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

/* ==================== START SERVER ==================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || "resume_builder"}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  if (!GOOGLE_CLIENT_ID) {
    console.log(`⚠️  Google OAuth not configured - email/password login only`);
  }
});
