// pages/Register.jsx
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setLoading(true);

  if (form.password !== form.confirmPassword) {
    setMessageType("error");
    setMessage("Passwords do not match");
    setLoading(false);
    return;
  }

  try {
    await axios.post("/api/auth/register", {
      name: form.name,
      email: form.email,
      password: form.password
    });

    setMessageType("success");
    setMessage("Registration successful! Redirecting to login...");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);

  } catch (err) {
    setMessageType("error");
    setMessage(
      err.response?.data?.message || "Registration failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full top-[-100px] left-[-100px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-amber-300/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[400px] p-10 rounded-2xl 
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_20px_60px_rgba(255,215,0,0.08)] 
        space-y-6"
      >

        {/* TITLE */}
        <div className="text-center">
          <h2 className="text-3xl font-light tracking-wide text-amber-400">
            Create Account
          </h2>
          <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">
            Lolakk by Athira
          </p>
        </div>

        {/* NAME */}
        <div className="relative">
          <input
            type="text"
            required
            placeholder=" "
            className="peer w-full p-3 bg-transparent border border-white/20 rounded-lg outline-none focus:border-amber-500"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <label className="absolute left-3 top-3 text-gray-400 text-sm 
            peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs 
            peer-focus:text-amber-400 bg-black px-1 transition-all">
            Full Name
          </label>
        </div>

        {/* EMAIL */}
        <div className="relative">
          <input
            type="email"
            required
            placeholder=" "
            className="peer w-full p-3 bg-transparent border border-white/20 rounded-lg outline-none focus:border-amber-500"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          <label className="absolute left-3 top-3 text-gray-400 text-sm 
            peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs 
            peer-focus:text-amber-400 bg-black px-1 transition-all">
            Email Address
          </label>
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder=" "
            className="peer w-full p-3 bg-transparent border border-white/20 rounded-lg outline-none focus:border-amber-500"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
          <label className="absolute left-3 top-3 text-gray-400 text-sm 
            peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs 
            peer-focus:text-amber-400 bg-black px-1 transition-all">
            Password
          </label>

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-xs text-amber-400 cursor-pointer"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder=" "
            className="peer w-full p-3 bg-transparent border border-white/20 rounded-lg outline-none focus:border-amber-500"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <label className="absolute left-3 top-3 text-gray-400 text-sm 
            peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs 
            peer-focus:text-amber-400 bg-black px-1 transition-all">
            Confirm Password
          </label>
        </div>

        {message && (
  <div
    className={`rounded-xl px-4 py-3 text-sm border backdrop-blur-md transition-all duration-300 ${
      messageType === "success"
        ? "bg-green-500/10 border-green-500/30 text-green-400"
        : "bg-red-500/10 border-red-500/30 text-red-400"
    }`}
  >
    <div className="flex items-center gap-2">
      <span className="text-lg">
        {messageType === "success" ? "✓" : "⚠"}
      </span>

      <span>{message}</span>
    </div>
  </div>
)}

        {/* BUTTON */}
       <button
  disabled={loading}
  className="w-full py-3 rounded-lg font-semibold 
  bg-gradient-to-r from-amber-600 to-yellow-400 text-black
  hover:opacity-90 transition shadow-lg disabled:opacity-50"
>
  {loading ? "Creating Account..." : "Register"}
</button>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-amber-400 hover:underline">
            Login
          </a>
        </div>

      </form>
    </div>
  );
}