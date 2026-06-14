import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { createServer } from "http";
import { Server } from "socket.io";

import path from "path";

import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

const httpServer = createServer(app);

// ==============================
// SECURITY
// ==============================



app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
);

// ==============================
// CORS
// ==============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://lolakk-website-deploy-l9ad.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ==============================
// BODY PARSER
// ==============================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==============================
// STATIC FILES
// ==============================

// app.use(
//   "/uploads",
//   express.static(
//     path.join(process.cwd(), "uploads"),
//     {
//       setHeaders: (res) => {
//         res.set(
//           "Cross-Origin-Resource-Policy",
//           "cross-origin"
//         );
//       },
//     }
//   )
// );

// ==============================
// SOCKET.IO
// ==============================

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("socketio", io);

// ==============================
// ROUTES
// ==============================

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/products", productRoutes);

app.use("/api/rentals", rentalRoutes);

app.use("/api/payments", paymentRoutes);

// ==============================
// SOCKET EVENTS
// ==============================

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.send("LOLAKK Backend Running 🚀");
});

// ==============================
// ERROR HANDLER
// ==============================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(
        `🚀 Server & WebSockets running on port ${PORT}`
      );

      console.log(
        "✅ Razorpay Key Loaded:",
        process.env.RAZORPAY_KEY_ID
          ? "YES"
          : "NO"
      );
    });
  } catch (error) {
    console.log("❌ Server startup failed");

    console.log(error);

    process.exit(1);
  }
};

startServer();