import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, connectDB } from "./config/db.js";
import "./models/Product.js";
import Admin from "./models/Admin.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Trust Hostinger's proxy so rate-limiter/IP detection works correctly
app.set("trust proxy", 1);

// Security headers
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }) // needed for /uploads images to load on frontend domain
);

// ---- CORS: strict whitelist only ----
const clientUrlEnv = process.env.CLIENT_URL || "";
const allowedOrigins = clientUrlEnv.split(",").map((s) => s.trim()).filter(Boolean);

if (allowedOrigins.length === 0) {
  console.warn("WARNING: CLIENT_URL is not set in .env — no origins are allowed by CORS.");
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server / curl / mobile apps
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.set("X-Content-Type-Options", "nosniff");
    },
  })
);
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Shree Kamal Nayan Frozen Food LLP API is running");
});

// Generic error handler — never leak internal error details to client
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const validateEnv = () => {
  const required = [
    "JWT_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "PG_DATABASE",
    "PG_USER",
    "PG_PASSWORD",
    "CLIENT_URL",
  ];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.error("JWT_SECRET is too short/weak. Use at least 32 (ideally 64+) random characters.");
    process.exit(1);
  }

  if (process.env.ADMIN_PASSWORD.length < 10) {
    console.error("ADMIN_PASSWORD is too weak. Use at least 10 characters with mixed case, numbers, symbols.");
    process.exit(1);
  }
};

const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env");
    return;
  }

  const existingAdmin = await Admin.findOne({ where: { email } });

  if (!existingAdmin) {
    await Admin.create({ name: "Admin", email, password });
    console.log(`Admin created: ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }
};

const start = async () => {
  validateEnv();
  await connectDB();
  await sequelize.sync();
  await ensureAdmin();
  app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
};

start();