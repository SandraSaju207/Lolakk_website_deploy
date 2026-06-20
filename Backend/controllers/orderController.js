import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import User from "../models/User.js";
import crypto from "crypto";


export const createOrder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("🔥 CREATE ORDER REQUEST:", req.body);

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const formattedItems = (req.body.items || []).map((item) => ({
      productId: item.productId || null,
      name: item.name,
      quantity: item.qty || item.quantity || 1,
      price: item.price || 0,
      image: item.image || "",
    }));

    // ❌ IMPORTANT FIX:
    // DO NOT create DB order here anymore
    // We only prepare data for payment

    return res.status(200).json({
      success: true,
      message: "Order ready for payment",
      amount: req.body.total,
      currency: "INR",
      customerName: req.body.customerName,
     customerEmail: decoded.email,
customerPhone: decoded.phone,
      items: formattedItems,
      shippingAddress: req.body.shippingAddress,
      userId: decoded.id,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};




export const verifyPayment = async (req, res) => {
  try {
    console.log("🔥 VERIFY PAYMENT HIT");
    console.log("🔥 VERIFY PAYMENT:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      customerName,
      amount,
    } = req.body;

    // VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // TOKEN CHECK
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

if (!user) {
  return res.status(401).json({
    success: false,
    message: "Invalid user session"
  });
}

    // ✅ FIXED CLEAN ADDRESS
    const cleanAddress = {
        name: shippingAddress?.name || "",  
      label: shippingAddress?.label || "",
      fullAddress: shippingAddress?.fullAddress || "",
      district: shippingAddress?.district || "",
      state: shippingAddress?.state || "",
      pincode: shippingAddress?.pincode || "",
      phone: shippingAddress?.phone || user.phone || ""
    };

    const newOrder = await Order.create({
      userId: user._id || null,

      customerName: user.name || customerName || "Guest User",
      customerEmail: user.email || "No Email",
      customerPhone: cleanAddress.phone,

      items: items || [],
      total: amount,

      shippingAddress: cleanAddress,

      status: "Order Confirmed",
      paymentStatus: "Paid",
    });

    const io = req.app.get("socketio");

    console.log("🔥 About to emit newOrder");

if (io) {
  io.emit("newOrder", {
    customer: newOrder.customerName,
    total: newOrder.total,
    orderId: newOrder._id,
  });

  console.log("✅ New Order Notification Sent");
}


    return res.json({
      success: true,
      message: "Payment verified & order created",
      order: newOrder,
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};