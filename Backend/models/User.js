import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: "user"
  },
address: [
  {
    name: String,
    label: String,

    country: {
      type: String,
      default: "India",
    },

    state: String,

    district: String,

    pincode: String,

    phone: String,

    fullAddress: String,

    lat: Number,

    lng: Number,

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
],
});

export default mongoose.model("User", userSchema);