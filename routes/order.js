import express from "express";
import { body, validationResult } from "express-validator";
import Order from "../models/Order.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const ALLOWED_STATUSES = ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"];

const validateOrder = [
  body("customerName").isString().trim().isLength({ min: 2, max: 100 }),
  body("customerPhone")
    .isString()
    .trim()
    .matches(/^[0-9+\-\s]{7,15}$/)
    .withMessage("Enter a valid phone number"),
  body("customerAddress").isString().trim().isLength({ min: 5, max: 500 }),
  body("notes").optional({ nullable: true }).isString().trim().isLength({ max: 500 }),
  body("items").isArray({ min: 1 }).withMessage("Cart is empty"),
  body("items.*.productId").exists(),
  body("items.*.name").isString().trim().isLength({ min: 1, max: 200 }),
  body("items.*.price").isFloat({ min: 0 }),
  body("items.*.quantity").isInt({ min: 1, max: 100 }),
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Invalid order data", errors: errors.array() });
  }
  next();
};

// @route   POST /orders  (public - customer places an order)
router.post("/", validateOrder, checkValidation, async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, notes, items } = req.body;

    // Recalculate total on the server — never trust a client-sent total
    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const order = await Order.create({
      customerName,
      customerPhone,
      customerAddress,
      notes: notes || null,
      items,
      totalAmount,
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Could not place order. Please try again." });
  }
});

// @route   GET /orders/admin/all  (admin only - list all orders)
router.get("/admin/all", protect, async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [["createdAt", "DESC"]] });
    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

// @route   GET /orders/admin/pending-count  (admin only - badge count for new orders)
router.get("/admin/pending-count", protect, async (req, res) => {
  try {
    const count = await Order.count({ where: { status: "Pending" } });
    res.json({ count });
  } catch (error) {
    console.error("Pending count error:", error);
    res.status(500).json({ message: "Something went wrong on the server" });
  }
});

// @route   PATCH /orders/:id/status  (admin only - update order status)
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Could not update order status" });
  }
});

export default router;