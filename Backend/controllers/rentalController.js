import Rental from "../models/Rental.js";

// @desc    Get all rentals
// @route   GET /api/rentals
export const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ createdAt: -1 });
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rentals", error: error.message });
  }
};

// @desc    Create a new rental
// @route   POST /api/rentals
export const createRental = async (req, res) => {
  try {
    const newRental = new Rental(req.body);
    const savedRental = await newRental.save();

    // Trigger Socket.io notification if attached to app
    const io = req.app.get("socketio");
    if (io) {
      io.emit("newRental", {
        customer: savedRental.customerName,
        item: savedRental.itemName,
        total: savedRental.total
      });
    }

    res.status(201).json(savedRental);
  } catch (error) {
    res.status(400).json({ message: "Error creating rental", error: error.message });
  }
};

// @desc    Update rental status
// @route   PATCH /api/rentals/:id
export const updateRentalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRental = await Rental.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Returns the modified document
    );

    if (!updatedRental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.status(200).json(updatedRental);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};