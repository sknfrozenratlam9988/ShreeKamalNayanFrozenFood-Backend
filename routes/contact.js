import express from "express";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

const router = express.Router();

// Limit abuse of the public contact endpoint (10 requests / 15 min / IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages sent. Please try again later." },
});

const validateContact = [
  body("name").isString().trim().isLength({ min: 2, max: 100 }),
  body("phone")
    .isString()
    .trim()
    .matches(/^[0-9+\-\s]{7,15}$/)
    .withMessage("Enter a valid phone number"),
  body("email").isString().trim().isEmail().withMessage("Enter a valid email"),
  body("message").isString().trim().isLength({ min: 5, max: 2000 }),
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid form data", errors: errors.array() });
  }
  next();
};

let transporter;
const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) !== 587, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

// @route   POST /contact  (public - website contact form)
router.post("/", contactLimiter, validateContact, checkValidation, async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("Contact form: SMTP env vars are not configured.");
      return res.status(500).json({ message: "Something went wrong on the server" });
    }

    const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

    await getTransporter().sendMail({
      from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
      to,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text:
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}`,
      html:
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
        `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` +
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
        `<p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form send error:", error);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default router;