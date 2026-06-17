import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [lastScroll, setLastScroll] = useState(0);
  const [hideNav, setHideNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ ADDED
  const dropdownRef = useRef(); // ✅ ADDED

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token"); // ✅ ADDED


  

  // ✅ AUTH PAGES CHECK
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.pageYOffset;

      if (current > 50) setMobileMenuOpen(false);

      if (current > lastScroll && current > 100) {
        setHideNav(true);
      } else {
        setHideNav(false);
      }

      setScrolled(current > 50);
      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // ✅ CLOSE DROPDOWN WHEN CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ ONLY LOGO NAVBAR (LOGIN + REGISTER)
  if (isAuthPage) {
    return (
      <nav className="fixed top-0 w-full h-[70px] md:h-[80px] z-50 px-4 md:px-6 flex justify-between items-center bg-black/80 backdrop-blur">
        
        <div className="flex items-center gap-2">
          <img src="/hero.png" className="h-12 md:h-18 w-auto" alt="logo" />
        </div>

        <div className="w-10"></div>
      </nav>
    );
  }

  return (
    <>
      {/* MAIN NAV */}
      <nav
        className={`fixed top-0 w-full h-[70px] md:h-[80px] z-50 px-4 md:px-6 flex justify-between items-center transition-all duration-300
        ${scrolled ? "bg-black/90 backdrop-blur-md" : "bg-black/40 backdrop-blur-sm"}
        ${hideNav ? "-translate-y-full" : "translate-y-0"}`}
      >
        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* LOGO */}
        <img src="/hero.png" className="h-12 md:h-18 w-auto" alt="logo" />

        {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center space-x-10 text-xs uppercase tracking-widest font-semibold text-white">
  
  <a href="/" className="hover:text-amber-500 transition">
    Home
  </a>

  <a href="#collection" className="hover:text-amber-500 transition">
    Collection
  </a>

  <a href="#contact" className="hover:text-amber-500 transition">
    Visit Us
  </a>

  <button
    onClick={() => navigate("/cart")}
    className="hover:text-amber-500 transition"
  >
    Cart
  </button>

</div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* ✅ UPDATED PROFILE BUTTON */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => {
                if (!token) {
                  navigate("/login");
                } else {
                  setDropdownOpen(!dropdownOpen);
                }
              }}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-amber-500 hover:text-black transition"
            >
              👤
            </button>

            {/* ✅ DROPDOWN MENU */}
{token && dropdownOpen && (
  <div className="absolute right-0 mt-2 w-40 bg-black border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
    
    <button
      onClick={() => {
        navigate("/profile");
        setDropdownOpen(false);
      }}
      className="w-full text-left px-4 py-2 hover:bg-white/10"
    >
      Profile
    </button>

    <button
      onClick={() => {
        navigate("/cart");
        setDropdownOpen(false);
      }}
      className="w-full text-left px-4 py-2 hover:bg-white/10"
    >
      Cart
    </button>

    {/* ✅ ADDED ORDERS OPTION */}
    <button
      onClick={() => {
        navigate("/orders");
        setDropdownOpen(false);
      }}
      className="w-full text-left px-4 py-2 hover:bg-white/10"
    >
      Orders
    </button>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
        // Good practice to also close the dropdown on logout
        setDropdownOpen(false); 
      }}
      className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10"
    >
      Logout
    </button>

  </div>
)}
          </div>

          <a
            href="https://wa.me/91XXXXXXXXXX"
            className="bg-amber-600 text-black px-3 py-2 md:px-5 md:py-2 text-[10px] md:text-xs font-bold whitespace-nowrap"
          >
            Book Appointment
          </a>
        </div>
      </nav>

      {/* MOBILE ANCHORED MENU */}
{mobileMenuOpen && (
  <div className="md:hidden absolute top-[70px] left-4 z-50 w-64">
    
    {/* arrow */}
    <div className="ml-3 w-3 h-3 bg-zinc-950 rotate-45 border-l border-t border-white/10"></div>

    {/* menu box */}
    <div className="bg-zinc-950/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">

      <MobileItem
        icon="🏠"
        label="Home"
        onClick={() => {
          navigate("/");
          setMobileMenuOpen(false);
        }}
      />

      <MobileItem
        icon="🛍️"
        label="Collection"
        onClick={() => {
          navigate("/");
          setTimeout(() => {
            document.getElementById("collection")?.scrollIntoView({
              behavior: "smooth",
            });
          }, 200);
          setMobileMenuOpen(false);
        }}
      />

      <MobileItem
        icon="📍"
        label="Visit Us"
        onClick={() => {
          navigate("/");
          setTimeout(() => {
            document.getElementById("contact")?.scrollIntoView({
              behavior: "smooth",
            });
          }, 200);
          setMobileMenuOpen(false);
        }}
      />

      <MobileItem
        icon="🛒"
        label="Cart"
        onClick={() => {
          navigate("/cart");
          setMobileMenuOpen(false);
        }}
      />
    </div>
  </div>
)}


     {/* PREMIUM MOBILE MENU (BOTTOM SHEET STYLE) */}


      {/* CATEGORY NAV */}
      <div
  className={`fixed w-full z-40 px-6 py-3 flex overflow-x-auto no-scrollbar
  text-[10px] uppercase tracking-[0.3em] font-medium 
  text-amber-500/80 border-b border-white/5 
  transition-all duration-300
  ${hideNav ? "top-0 bg-black/95" : "top-[80px] bg-zinc-900/90"}`}
>
  <div className="flex items-center space-x-8 min-w-max mx-auto px-4">
    <a href="/Rental" className="hover:text-white transition-colors duration-300">Rentals</a>
    <span className="text-white/20">|</span>

    <a href="/Rings" className="hover:text-white transition-colors duration-300">Rings</a>
    <span className="text-white/20">|</span>

    <a href="/Earrings" className="hover:text-white transition-colors duration-300">Earrings</a>
    <span className="text-white/20">|</span>

    <a href="/Bracelets-bangles" className="hover:text-white transition-colors duration-300">Bracelets & Bangles</a>
    <span className="text-white/20">|</span>

    {/* <a href="/Solitaries" className="hover:text-white transition-colors duration-300">Solitaries</a>
    <span className="text-white/20">|</span> */}

    <a href="/Necklaces-pendants" className="hover:text-white transition-colors duration-300">Necklaces</a>
    <span className="text-white/20">|</span>

    {/* <a href="/Gifting" className="hover:text-white transition-colors duration-300">Gifting</a>
    <span className="text-white/20">|</span> */}

    {/* <a href="/More-jewellery" className="hover:text-white transition-colors duration-300">More</a>
    <span className="text-white/20">|</span> */}

    <a href="/kids" className="hover:text-white transition-colors duration-300">Kids</a>
    <span className="text-white/20">|</span>

    <a href="/Trending" className="hover:text-white transition-colors duration-300">Trending</a>
  </div>
</div>
    </>
    
  );
}

function MobileItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-4 rounded-xl
      bg-white/5 hover:bg-white/10 active:scale-[0.98]
      transition text-left"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm tracking-wide">{label}</span>
    </button>
  );
}