import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    // ✅ UNIQUE RENTAL ID
    rentalId: {
      type: String,
      unique: true,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    itemName: {
      type: String,
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    rentalPeriod: {
      start: {
        type: Date,
        required: true,
      },

      end: {
        type: Date,
        required: true,
      },
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,

      enum: [
        "Rental Order Accepted",
        "Collect the Order at Store",
        "Active",
        "Returned",
        "Cancelled",
      ],

      default: "Rental Order Accepted",
      required: true,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    invoiceUrl: {
      type: String,
    },

    notes: {
      type: String,
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

// ✅ Prevent overwrite
const Rental =
  mongoose.models.Rental || mongoose.model("Rental", rentalSchema);

export default Rental;