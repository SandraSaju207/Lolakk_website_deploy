import express from "express";
import Rental from "../models/Rental.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

// @desc    Get all rentals
// @route   GET /api/rentals
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ createdAt: -1 });
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rentals", error: error.message });
  }
});

// @desc    Create a new rental (FIXES THE 404 ERROR)
// @route   POST /api/rentals
// @desc Create Rental
// @route POST /api/rentals

router.post("/", async (req, res) => {
  try {

    // ✅ Generate Unique Rental ID
    const rentalId =
      "RLK-" + Date.now();

    const newRental = new Rental({
      rentalId,
      customerName: req.body.customerName,
      itemName: req.body.itemName,
          productId: product?._id,
       productImage: product?.image,

      rentalPeriod: {
        start: req.body.rentalPeriod.start,
        end: req.body.rentalPeriod.end,
      },

      total: req.body.total,

      status:
        req.body.status ||
        "Rental Order Accepted",
    });

    const savedRental =
      await newRental.save();

    // ✅ Socket.io notification
    const io = req.app.get("socketio");

    if (io) {
      io.emit("newRental", {
        customer: savedRental.customerName,
        item: savedRental.itemName,
        total: savedRental.total,
      });
    }

    res.status(201).json(savedRental);

  } catch (error) {

    console.log(error);

    res.status(400).json({
      message: "Error creating rental",
      error: error.message,
    });
  }
});

// @desc    Update rental status
// @route   PATCH /api/rentals/:id
router.patch("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedRental = await Rental.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedRental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.status(200).json(updatedRental);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
});

export default router;