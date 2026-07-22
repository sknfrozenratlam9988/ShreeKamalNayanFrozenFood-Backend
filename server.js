import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, connectDB } from "./config/db.js";
import "./models/Product.js";
import Admin from "./models/Admin.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const clientUrlEnv = process.env.CLIENT_URL || "";
const allowedOrigins = clientUrlEnv.split(",").map((s) => s.trim()).filter(Boolean);
const allowAllOrigins = process.env.ALLOW_ALL_ORIGINS === "true" || process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests like curl or server-to-server
      if (!origin) return callback(null, true);
      // Allow all origins in development / when explicitly enabled
      if (allowAllOrigins) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Shree Kamal Nayan Frozen Food LLP API is running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD is missing in .env");
    return;
  }

  const existingAdmin = await Admin.findOne({ where: { email } });

  if (!existingAdmin) {
    await Admin.create({
      name: "Admin",
      email,
      password,
    });
    console.log(`Admin created: ${email}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }
};

const start = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  await ensureAdmin();
  app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
};

start();