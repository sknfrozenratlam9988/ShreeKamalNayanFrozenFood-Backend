import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email: email?.toLowerCase() } });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
