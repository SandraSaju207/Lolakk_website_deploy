import express from "express";
import { createOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";
import { cancelOrder } from "../controllers/orderController.js";

const router = express.Router();

router.get("/test-route", (req, res) => {
  res.json({
    success: true,
    message: "Order routes working",
  });
});


router.put("/:id/cancel", protect, cancelOrder);

router.get("/", protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== "admin") {
      query.userId = req.user.id;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
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

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled orders can be deleted",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;