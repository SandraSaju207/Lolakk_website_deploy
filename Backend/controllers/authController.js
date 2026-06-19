import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const {  name,email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

   const user = await User.create({
  name,
  email,
  password: hashed
});

    res.json({ message: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
   const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

   const token = jwt.sign(
  {
    id: user._id,
    role: user.role
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.json({
  token,
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};