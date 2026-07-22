import express from "express";
import { Op } from "sequelize";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

const makeSlug = (name) =>
  name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

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
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/admin/all  (admin - includes inactive)
router.get("/admin/all", protect, async (req, res) => {
  try {
    const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:slug  (public - single product by slug)
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ where: { slug: req.params.slug } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products  (admin - create)
router.post("/", protect, async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug) body.slug = makeSlug(body.name);
    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "A product with this name/slug already exists" });
    }
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id  (admin - update)
router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const body = { ...req.body };
    if (body.name && !body.slug) body.slug = makeSlug(body.name);

    await product.update(body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products/upload/images  (admin - image upload, returns URLs)
router.post("/upload/images", protect, (req, res) => {
  upload.array("images", 6)(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ message: err.message || "Image upload failed" });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const urls = req.files.map((f) => `/uploads/${f.filename}`);
      res.json({ urls });
    } catch (error) {
      console.error("Route error:", error);
      res.status(500).json({ message: error.message });
    }
  });
});

export default router;
