import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function AdminLayout({ children, setActiveTab, activeTab }) {
  const menu = ["dashboard", "orders", "rentals", "stock"];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

  return (
    <div className="flex min-h-screen bg-[#0b0b0c] text-[#eaeaea] font-sans">
      
      {/* SIDEBAR (Unchanged) */}
      <div className="w-64 p-6 relative border-r border-white/10 bg-gradient-to-b from-[#111111] via-[#0d0d0d] to-[#090909] backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#d4af37]/20 to-transparent blur-2xl opacity-30"></div>
        <h1 className="text-2xl font-serif mb-6 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f5e6b3] to-[#d4af37]">
  LOLAKK
</h1>

<button
  onClick={() => navigate("/")}
  className="w-full mb-4 px-4 py-3 rounded-xl bg-[#d4af37] text-black font-semibold hover:scale-[1.02] transition"
>
  🏠 Back to Website
</button>

<div className="space-y-3 relative z-10">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`group w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item
                  ? "bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-black shadow-lg shadow-[#d4af37]/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="tracking-wide">{item.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-xl relative z-50">
          <h2 className="text-lg tracking-wide capitalize text-gray-200">
            {activeTab}
          </h2>

          <div className="flex items-center gap-6">

  
            {/* Notification (Unchanged) */}
            <div className="relative cursor-pointer group">
              <div className="p-2 rounded-full bg-white/5 backdrop-blur-md group-hover:scale-110 transition">
                <span className="text-[#d4af37] text-lg">🔔</span>
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d4af37] text-black text-[10px] flex items-center justify-center rounded-full shadow">
                1
              </span>
            </div>

            {/* UPDATED: Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] via-[#f5e6b3] to-[#b8962e] shadow-lg group-hover:scale-105 transition border border-white/10"></div>
                <div className="hidden md:block text-left">
                  <p className="text-xs text-gray-400 leading-none mb-1">Welcome,</p>
                  <p className="text-sm text-gray-200 font-medium leading-none">Admin ✨</p>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* DROPDOWN MENU */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden py-2 backdrop-blur-2xl animate-in fade-in zoom-in duration-200">
                  <button 
                    onClick={() => { setActiveTab('profile'); setIsDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-[#d4af37] transition"
                  >
                    <span>👤</span> Visit Profile
                  </button>
                  
                  <div className="h-[1px] bg-white/5 mx-2"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto relative">
          <div className="absolute top-10 right-10 w-72 h-72 bg-[#d4af37]/10 blur-[120px] rounded-full"></div>
          <div className="relative z-10">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}