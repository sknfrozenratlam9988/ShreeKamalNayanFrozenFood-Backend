import express from "express";
import { Op } from "sequelize";
import { body, validationResult } from "express-validator";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";
// import upload from "../middleware/upload.js";
import sharp from "sharp";
import path from "path";
import upload, { uploadDirPath } from "../middleware/upload.js";

const router = express.Router();

const makeSlug = (name) =>
  name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const ALLOWED_FIELDS = [
  "name",
  "slug",
  "category",
  "shortDescription",
  "description",
  "price",
  "unit",
  "stock",
  "images",
  "thumbnail",
  "nutrition",
  "features",
  "storageInstructions",
  "isFeatured",
  "isActive",
  "rating",
];
const pickAllowedFields = (source) => {
  const result = {};
  for (const key of ALLOWED_FIELDS) {
    if (source[key] !== undefined) result[key] = source[key];
  }
  return result;
};

const ALLOWED_CATEGORIES = ["Frozen Vegetables", "Frozen Fruits", "Ready To Eat", "Other"];

const validateProduct = [
  body("name").optional().isString().trim().isLength({ min: 1, max: 200 }),
  body("slug").optional().isString().trim().isLength({ max: 200 }),
  body("category").optional().isIn(ALLOWED_CATEGORIES),
  body("shortDescription").optional().isString().trim().isLength({ max: 300 }),
  body("description").optional().isString().trim().isLength({ max: 5000 }),
  body("price").optional().isFloat({ min: 0 }),
  body("unit").optional().isString().trim().isLength({ max: 100 }),
  body("stock").optional().isInt({ min: 0 }),
  body("thumbnail").optional().isString().trim().isLength({ max: 500 }),
  body("storageInstructions").optional().isString().trim().isLength({ max: 500 }),
  body("isFeatured").optional().isBoolean(),
  body("isActive").optional().isBoolean(),
  body("rating").optional().isFloat({ min: 0, max: 5 }),
  // images/nutrition/features are JSONB — checked as arrays/objects, not strict-typed here
  body("images").optional().isArray(),
  body("nutrition").optional().isObject(),
  body("features").optional().isArray(),
];
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid input", errors: errors.array() });
  }
  next();
};

// @route   GET /api/products   (public - list, supports ?category=&search=&featured=)
router.get("/", async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const where = { isActive: true };
    if (category && category !== "All") where.category = category;
    if (featured === "true") where.isFeatured = true;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { shortDescription: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const products = await Product.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

// @route   GET /api/products/admin/all  (admin - includes inactive)
router.get("/admin/all", protect, async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    res.json(products);
  } catch (error) {
    console.error("Admin get products error:", error);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

// @route   GET /api/products/:slug  (public - single product by slug)
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ where: { slug: req.params.slug } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get product by slug error:", error);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

// @route   POST /api/products  (admin - create)
router.post("/", protect, validateProduct, checkValidation, async (req, res) => {
  try {
    const body = pickAllowedFields(req.body);
    if (!body.name) return res.status(400).json({ message: "Product name is required" });
    if (!body.slug) body.slug = makeSlug(body.name);
    if (!body.thumbnail) return res.status(400).json({ message: "Thumbnail is required" });

    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "A product with this name/slug already exists" });
    }
    console.error("Create product error:", error);
    res.status(400).json({ message: "Could not create product" });
  }
});

// @route   PUT /api/products/:id  (admin - update)
router.put("/:id", protect, validateProduct, checkValidation, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const body = pickAllowedFields(req.body);
    if (body.name && !body.slug) body.slug = makeSlug(body.name);

    await product.update(body);
    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(400).json({ message: "Could not update product" });
  }
});

// @route   DELETE /api/products/:id  (admin - delete)
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.destroy();
    res.json({ message: "Product deleted", _id: req.params.id });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

// @route   POST /api/products/upload/images  (admin - image upload, returns URLs)
router.post("/upload/images", protect, (req, res) => {
  upload.array("images", 6)(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ message: err.message || "Image upload failed" });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const urls = [];

      for (const file of req.files) {
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(uploadDirPath, filename);

        // Resize to max 1200px width, convert to WebP, compress to ~80% quality
        await sharp(file.buffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);

        urls.push(`/uploads/${filename}`);
      }

      res.json({ urls });
    } catch (error) {
      console.error("Route error:", error);
      res.status(500).json({ message: "Image upload failed" });
    }
  });
});
export default router;