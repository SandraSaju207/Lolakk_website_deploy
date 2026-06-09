import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👤 GET CURRENT USER
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➕ ADD ADDRESS
router.post("/address", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const newAddress = {
      name: req.body.name || user.name || "Guest",
      label: req.body.label,
      fullAddress: req.body.fullAddress,
      district: req.body.district,
      state: req.body.state,
      pincode: req.body.pincode,
      phone: req.body.phone,
    };

    user.address.push(newAddress);

    await user.save();

    res.json(user.address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✏️ UPDATE ADDRESS
router.put("/address/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const addr = user.address.id(req.params.id);

    Object.assign(addr, req.body);

    await user.save();

    res.json(user.address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ❌ DELETE ADDRESS
router.delete("/address/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.address.id(req.params.id).deleteOne();

    await user.save();

    res.json(user.address);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;