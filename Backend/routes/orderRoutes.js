import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    let query = {};

if (req.user.role !== "admin") {
  query.userId = req.user.id;
}

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      query.userId = decoded.id;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email"); // 👈 ADD THIS

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, createOrder);

router.patch("/:id", protect, adminOnly, async (req, res) => {
  /* your patch code */
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after"}
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;