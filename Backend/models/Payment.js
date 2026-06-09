import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
      required: true,
      unique: true,
    },

    signature: {
      type: String,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
      required: true,
    },

    customerPhone: {
      type: String,
      required: true,
    },
    items: [
  {
    productId: String,
    name: String,
    quantity: Number,
    price: Number,
    image: String,
  },
],

shippingAddress: {
  type: Object,
},

    productName: {
      type: String,
      default: "",
    },

    rentalDuration: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Paid", "Failed", "Pending"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;