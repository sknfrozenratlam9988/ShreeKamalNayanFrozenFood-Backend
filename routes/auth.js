import express from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import Admin from "../models/Admin.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  secure: true,        // HTTPS only — aapke case me theek hai kyoki backend HTTPS pe hai
  sameSite: "none",     // cross-domain cookie ke liye zaroori (frontend/backend alag domain hain)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, JWT expiry ke match
  path: "/",
};

// @route   POST /api/auth/login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ where: { email: email.toLowerCase().trim() } });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(admin.id, admin.role);

    res.cookie("token", token, cookieOptions);

    res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      // token ab response body me nahi bhej rahe — cookie me hai
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

// @route   POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
  res.json({ message: "Logged out successfully" });
});

export default router;