const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "יש להזין שם משתמש וסיסמה",
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: { password: true },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        message: "שם משתמש או סיסמה שגויים",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        message: "שם משתמש או סיסמה שגויים",
      });
    }

    const token = jwt.sign(
      {
        userId: user.idNumber,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.idNumber,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "שגיאת שרת",
    });
  }
}

module.exports = {
  login,
};