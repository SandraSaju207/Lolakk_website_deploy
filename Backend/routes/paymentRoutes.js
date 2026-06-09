import express from "express";
import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

const router = express.Router();

// CREATE ORDER
router.post("/create-order", async (req, res) => {
  try {
    const {
      amount,
      customerName,
      customerEmail,
      customerPhone,
      productName,
      rentalDuration,
    } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(
      options
    );

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});

// VERIFY PAYMENT
router.post("/verify-payment", async (req, res) => {
  try {
     console.log("VERIFY BODY:", req.body);
  const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,

  customerName,
  customerEmail,
  customerPhone,

  amount,
  items,
  shippingAddress,
} = req.body;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
          "|" +
          razorpay_payment_id
      )
      .digest("hex");

    const isAuthentic =
      generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    // SAVE PAYMENT
   // SAVE PAYMENT
const payment = await Payment.create({
  orderId: razorpay_order_id,
  paymentId: razorpay_payment_id,
  signature: razorpay_signature,

  customerName: customerName || "Guest",
  customerEmail: customerEmail || "guest@example.com",
  customerPhone: customerPhone || "9999999999",

  items: items || [],
  shippingAddress: shippingAddress || {},

  amount,
  paymentStatus: "Paid",
});



console.log("FINAL ORDER:", {
  userId: req.body.userId,
  customerName: req.body.customerName,
  customerEmail: req.body.customerEmail,
});

// 🔥 CREATE ORDER (THIS WAS MISSING)
await Order.create({
  userId: req.body.userId || null,

  customerName: req.body.customerName || "Guest User",
  customerEmail: req.body.customerEmail || "guest@example.com",
  customerPhone: req.body.customerPhone || "9999999999",

  items: req.body.items || [],
  total: req.body.amount,

  shippingAddress: req.body.shippingAddress || {},

  status: "Order Confirmed",
  paymentStatus: "Paid",
});
//     await Order.create({
//   customerName,
//   total: amount,

//   items,

//   shippingAddress,

//   paymentStatus: "Paid",

//   status: "Order Confirmed",
// });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
});

export default router;