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

router.put(
  "/:id/request-return",
  protect,
  async (req, res) => {
    try {
      const order = await Order.findById(
        req.params.id
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      if (order.status !== "Delivered") {
        return res.status(400).json({
          message:
            "Only delivered orders can be returned",
        });
      }

      const days =
        (Date.now() -
          new Date(order.deliveredAt)) /
        (1000 * 60 * 60 * 24);

      if (days > 7) {
        return res.status(400).json({
          message:
            "Return period expired",
        });
      }

      order.returnRequested = true;
      order.returnReason =
        req.body.reason || "";
        order.returnStatus = "Pending";

      order.returnRequestedAt =
        new Date();

      await order.save();

      res.json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

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

router.post("/international", protect, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
    } = req.body;

    const productTotal = items.reduce(
      (sum, item) =>
        sum + item.price * (item.qty || item.quantity || 1),
      0
    );

    const order = await Order.create({
      userId: req.user.id,

      customerName,
      customerEmail,
      customerPhone,

      items,

      total: productTotal,

      deliveryCharge: 0,

      isInternational: true,

      shippingChargeAdded: false,

      shippingAddress,

      status: "Awaiting Shipping Quote",

      paymentStatus: "Pending",
    });

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.put(
  "/:id/shipping-charge",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { deliveryCharge } = req.body;

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const productTotal = order.items.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      );

      order.deliveryCharge = Number(deliveryCharge);

      order.shippingChargeAdded = true;

      order.total =
        productTotal + Number(deliveryCharge);

      order.status = "Ready For Payment";

      await order.save();

      res.json({
        success: true,
        order,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);


router.patch("/:id", protect, adminOnly, async (req, res) => {
  /* your patch code */
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.status === "Delivered") {
      updateData.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
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

router.put(
  "/:id/approve-return",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.returnStatus = "Approved";
      order.refundStatus = "Pending";

      await order.save();

      res.json({
        success: true,
        message: "Return approved",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
router.put(
  "/:id/reject-return",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.returnStatus = "Rejected";

      await order.save();

      res.json({
        success: true,
        message: "Return rejected",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);
router.put(
  "/:id/mark-returned",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      order.status = "Returned";
      order.returnStatus = "Returned";

      await order.save();

      res.json({
        success: true,
        message: "Product marked returned",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.put(
  "/:id/refund",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      order.refundStatus = "Refunded";
      order.returnStatus = "Returned";
      order.status = "Returned";

      await order.save();

      res.json({
        success: true,
        message: "Refund marked completed",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

export default router;