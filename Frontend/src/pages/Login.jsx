import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setMessage("");

  try {
    
   const res = await axios.post(
  `${API}/api/auth/login`,
  form
);
   console.log(res.data);
    

  localStorage.setItem("token", res.data.token);
  

localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

localStorage.setItem("userId", res.data.user._id);
localStorage.setItem("userEmail", res.data.user.email);
console.log("Logged User:", res.data.user);

    setMessageType("success");
    setMessage("Login successful! Redirecting...");

    setForm({
  email: "",
  password: "",
});

    setTimeout(() => {
      const role = res.data.user.role;

      if (role === "admin") {
  window.location.href = "/admin";
} else {
  const redirectPath =
    localStorage.getItem("redirectAfterLogin") || "/";

  localStorage.removeItem("redirectAfterLogin");

  window.location.href = redirectPath;
}
    }, 1500);

  } catch (err) {
    setMessageType("error");
    setMessage(
      err.response?.data?.message || "Invalid email or password"
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

      {/* LOGIN CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[380px] p-10 rounded-2xl 
        bg-white/5 backdrop-blur-xl border border-white/10 
        shadow-[0_20px_60px_rgba(255,215,0,0.08)] 
        space-y-6"
      >

        {/* TITLE */}
        <div className="text-center">
          <h2 className="text-3xl font-light tracking-wide text-amber-400">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">
            Lolakk by Athira
          </p>
        </div>

        {/* EMAIL */}
        <div className="relative">
          <input
            type="email"
            required
            placeholder=" "
            className="peer w-full p-3 bg-transparent border border-white/20 rounded-lg outline-none focus:border-amber-500 transition"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          <label className="absolute left-3 top-3 text-gray-400 text-sm 
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-amber-400
            bg-black px-1 transition-all">
            Email Address
          </label>
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder=" "
            className="peer w-full p-3 bg-transparent border border-white/20 rounded-lg outline-none focus:border-amber-500 transition"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
          <label className="absolute left-3 top-3 text-gray-400 text-sm 
            peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-amber-400
            bg-black px-1 transition-all">
            Password
          </label>

          {/* SHOW/HIDE */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-xs text-amber-400 cursor-pointer"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* MESSAGE UI */}
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
  className="w-full py-3 rounded-lg font-semibold tracking-wide 
  bg-gradient-to-r from-amber-600 to-yellow-400 text-black
  hover:opacity-90 transition shadow-lg disabled:opacity-50"
>
  {loading ? "Logging in..." : "Login"}
</button>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-amber-400 hover:underline">
            Create one
          </a>
        </div>

      </form>
    </div>
  );
}