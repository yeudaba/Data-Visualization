require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ ok: true, time: result.rows[0].now });
  } catch (error) {
    console.error("Health error:", error);
    res.status(500).json({ ok: false, error: "Database connection failed" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "יש להזין שם משתמש וסיסמה" });
    }

    const result = await pool.query(
      `
      SELECT id, username, password_hash, full_name, role
      FROM admin_users
      WHERE username = $1
      LIMIT 1
      `,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "שם משתמש או סיסמה שגויים" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "שגיאת שרת" });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});