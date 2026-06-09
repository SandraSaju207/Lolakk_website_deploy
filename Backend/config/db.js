import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const connectDB = async () => {
  try {
  console.log("MONGO_URI:", process.env.MONGO_URI);

await mongoose.connect(process.env.MONGO_URI);

console.log("Connected URI:", process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // ✅ ADMIN SEED
    const adminEmail = "Lolakk@2026";
    const adminPassword = "Lolakk123";

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
  name: "Admin",
  email: adminEmail,
  password: hashedPassword,
  role: "admin",
});

      console.log("Admin user created");
    } else {
      console.log("Admin already exists");
    }

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;