import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false // 👈 IMPORTANT: keep false first to avoid breaking old orders
},
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true }, 
items: [{
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

  name: String,

  quantity: {
    type: Number,
    default: 1
  },

  price: Number,

  image: String,

  size: {
    type: String,
    default: ""
  }
}],
  total: { type: Number, required: true, default: 0 },
  deliveryCharge: {
  type: Number,
  default: 0,
},

isInternational: {
  type: Boolean,
  default: false,
},

shippingChargeAdded: {
  type: Boolean,
  default: false,
},
  status: { 
    type: String, 
    // Updated to match your specific requirements
   enum: [
  "Awaiting Shipping Quote",
  "Ready For Payment",
  "Order Confirmed",
  "Processing",
  "Ready to be Shipped",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned"
],
    default: "Order Confirmed" 
  },
shippingAddress: {
  name: String,  
  label: String,
  fullAddress: String,
  district: String,
  state: String,
  pincode: String,
  phone: { type: String, required: true }
},
expectedDeliveryDate: {
  type: Date,
},
 trackingId: {
  type: String,
  default: "",
},

courier: {
  type: String,
  default: "",
},
 paymentStatus: {
  type: String,
  enum: [
    "Pending",
    "Unpaid",
    "Paid",
    "Refunded",
  ],
  default: "Pending",
},
  deliveredAt: { type: Date }, // Needed to calculate the 7-day return window
 returnRequested: {
  type: Boolean,
  default: false,
},

returnReason: {
  type: String,
  default: "",
},

returnStatus: {
  type: String,
  enum: [
    "None",
    "Pending",
    "Approved",
    "Rejected",
    "Returned",
  ],
  default: "None",
},

refundStatus: {
  type: String,
  enum: [
    "None",
    "Pending",
    "Refunded",
  ],
  default: "None",
},

returnRequestedAt: {
  type: Date,

},
  invoiceUrl: { type: String }  // Link to the generated bill
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;