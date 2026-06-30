import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const API_URL = API;

const INITIAL_FILTERS = {
  accessoryType: "all",
  color: "all",
  price: "all",
};

export default function HairAccessories(){
const [hairAccessories, setHairAccessories]  = useState([]);

  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState("latest");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [cart, setCart] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

 const isLoggedIn = !!localStorage.getItem("token");

  // ---------------- FETCH FROM BACKEND ----------------
  useEffect(() => {
    const fetchhairAccessories= async () => {
      try {
       const res = await axios.get(`${API_URL}/api/products`);

console.log("API_URL:", API_URL);
console.log("FULL RESPONSE:", res);
console.log("DATA:", res.data);
console.log("IS ARRAY:", Array.isArray(res.data));

const products = Array.isArray(res.data)
  ? res.data
  : res.data.products || [];

const hairData = products.filter(
  (p) =>
    p.type === "hair-accessories" ||
    p.category === "hair-accessories"
);

setHairAccessories(hairData);
      } catch (err) {
        console.error("Error fetching hair accessories:", err);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchhairAccessories();
  }, []);

  // ---------------- IMAGE HELPER ----------------
  const getImage = (img) =>
    img?.startsWith("http") ? img : `${API_URL}${img}`;

  // ---------------- FILTERS ----------------
  const isFiltered =
    JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS) ||
    sort !== "latest";

  const clearAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSort("latest");
  };

  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // ---------------- MODAL ----------------
  const openModal = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // ---------------- CART ----------------
 const addToCart = (item) => {
  if (!isLoggedIn) {
    window.location.href = "/login";
    return;
  }

  const userId = localStorage.getItem("userId");

  const currentCart =
    JSON.parse(
      localStorage.getItem(`lolakk_cart_${userId}`)
    ) || [];

  const cartItem = {
    id: item._id,
    name: item.name,
    price: item.price,
    image: item.image.startsWith("http")
      ? item.image
      : `${API_URL}${item.image}`,
    qty: 1,
  };

  const existingItemIndex = currentCart.findIndex(
    (cartItem) => cartItem.id === item._id
  );

  let updatedCart;

  if (existingItemIndex > -1) {
    updatedCart = [...currentCart];
    updatedCart[existingItemIndex].qty += 1;
  } else {
    updatedCart = [...currentCart, cartItem];
  }

  localStorage.setItem(
    `lolakk_cart_${userId}`,
    JSON.stringify(updatedCart)
  );

  setCart(updatedCart);

  setNotification({
    message: `${item.name} added to cart!`,
  });

  setTimeout(() => setNotification(null), 3000);
};

  // ---------------- BUY NOW ----------------
  const buyNow = (item) => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    localStorage.setItem(
      "lolakk_buy_now",
      JSON.stringify({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image.startsWith("http")
  ? item.image
  : `${API_URL}${item.image}`,
        qty: 1,
      })
    );

    window.location.href = "/checkout";
  };

  // ---------------- FILTERED + SORTED ----------------
 const filteredItems = hairAccessories.filter((item) => {
    const price = parseFloat(item.price) || 0;

    return (
      (filters.accessoryType === "all" ||
(item.accessoryType || "").toLowerCase() ===
filters.accessoryType)

&&

(filters.color === "all" ||
(item.color || "").toLowerCase() ===
filters.color) &&
      (filters.price === "all" ||
        (filters.price === "below500" && price < 500) ||
        (filters.price === "500to1000" && price >= 500 && price <= 1000) ||
        (filters.price === "above1000" && price > 1000))
    );
  });

  // const similarProducts = selectedProduct
  //   ? earrings.filter(
  //       (r) =>
  //         r.type === selectedProduct.type &&
  //         r._id !== selectedProduct._id
  //     )
  //   : [];

// ✅ SORT
const sortedItems = [...filteredItems].sort((a, b) => {
  if (sort === "priceLow") return a.price - b.price;

  if (sort === "priceHigh") return b.price - a.price;

  if (sort === "latest") {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }

  return 0;
});

// ✅ SIMILAR PRODUCTS
const similarProducts = selectedProduct
   ? hairAccessories.filter(
      (item) =>
        item.type === selectedProduct.type &&
        item._id !== selectedProduct._id
    )
  : [];

 // LOADER VIEW
 if (loading) {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,220,120,.15),transparent_45%),radial-gradient(circle_at_center,rgba(255,255,255,.03),transparent_70%)]" />

      {/* Main Content */}
      <div className="relative w-72 h-60 flex flex-col items-center justify-center">

        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-amber-900/20 blur-3xl scale-75 animate-[softGlow_4s_ease-in-out_infinite]" />

        {/* Earrings (CLOSER NOW) */}
     <div className="relative z-10 flex gap-2 mb-0">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="earring origin-top"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
             <svg width="50" height="120" viewBox="0 0 90 220">
  <defs>
    <linearGradient id={`gold${i}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fff7d6" />
      <stop offset="40%" stopColor="#fbbf24" />
      <stop offset="100%" stopColor="#8b5a00" />
    </linearGradient>
  </defs>

  {/* Floral Stud */}
 <g>
  {[0,45,90,135,180,225,270,315].map((r,n)=>(
    <ellipse
      key={n}
      cx="45"
      cy="25"
      rx="5"
      ry="13"
      fill="none"
      stroke={`url(#gold${i})`}
      strokeWidth="3"
      transform={`rotate(${r} 45 25)`}
    />
  ))}
  <circle
    cx="45"
    cy="25"
    r="10"
    fill={`url(#gold${i})`}
  />
  <rect
    x="40"
    y="20"
    width="10"
    height="10"
    rx="2"
    fill="#fff2b2"
    opacity=".4"
  />
</g>
{/* Connector Ring */}
{/* Small Ring */}
<circle cx="45"
 cy="48"
  r="6"
  fill="none"
  stroke={`url(#gold${i})`}
  strokeWidth="2.5"
/>
<path
  d="
    M32 58
    Q45 50 58 58
    Q60 64 55 72
    Q45 78 35 72
    Q30 64 32 58
    Z
  "
  fill={`url(#gold${i})`}
/>
{/* Top Highlight */}
<ellipse
  cx="45"
  cy="64"
  rx="8"
  ry="3"
  fill="white"
  opacity=".25"
/>
 {/* Main Jhumka Dome */}
  <path
  d="
    M18 72
    C22 120 68 120 72 72
    Z
  "
  fill={`url(#gold${i})`}
/>
  {/* Dome Strands */}
 {[22,28,34,40,45,50,56,62,68].map((x,n)=>(
  <path
    key={n}
    d={`M45 74 Q${x} 100 ${x} 136`}
    stroke="#fff2b2"
    strokeWidth="2"
    fill="none"
    opacity=".9"
  />
))}
  {/* Bottom Rim */}

  <rect
  x="18"
  y="132"
  width="54"
  height="8"
  rx="4"
  fill={`url(#gold${i})`}
/>

  {/* Hanging Loops */}

 {[22,30,38,46,54,62,70].map((x,n)=>(
  <circle
    key={n}
    cx={x}
    cy="147"
    r="4"
    fill="none"
    stroke={`url(#gold${i})`}
    strokeWidth="2"
  />
))}
  {/* Pearls */}

  {[22,30,38,46,54,62,70].map((x,n)=>(
  <g key={n}>
    <line
      x1={x}
      y1="150"
      x2={x}
      y2="164"
      stroke="#D4AF37"
      strokeWidth="1"
    />
    <circle
      cx={x}
      cy="168"
      r="4.5"
      fill="#fffef9"
    />
  </g>
))}
</svg>
            </div>
          ))}
        </div>

        {/* TEXT MOVED JUST BELOW EARRINGS */}
     <div className="relative z-10 -mt-2">
         <h2 className="text-4xl serif gold-gradient tracking-[0.30em] mb-0">
            LOLAKK
          </h2>
          <p className="text-gray-400 italic font-light tracking-wide text-sm">
            by Athira
          </p>
        </div>

      </div>

      {/* Progress Bar */}
     <div className="-mt-4 w-44 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 bg-amber-500 animate-[progressBar_2.8s_linear_forwards]" />
      </div>

      {/* Styles */}
      <style>{`
        @keyframes softGlow {
          0%,100% { opacity:.45; transform:scale(.75); }
          50% { opacity:1; transform:scale(1); }
        }

        .serif {
          font-family:'Playfair Display',serif;
        }

        .gold-gradient {
          background: linear-gradient(to right, #b8860b, #fff2b2, #d4af37, #8b6508);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .earring {
          transform-origin:45px 12px;
           animation:swing 3.5s ease-in-out infinite;
          filter:drop-shadow(0 0 8px rgba(251,191,36,.35));
        }

        .dome {
          transform-origin:45px 40px;
          animation:domeLag 2.8s ease-in-out infinite;
        }

        @keyframes swing {
          0%,100% { transform:rotate(-16deg); }
          50% { transform:rotate(16deg); }
        }

        @keyframes domeLag {
          0%,100% { transform:rotate(-10deg); }
          50% { transform:rotate(10deg); }
        }
      `}</style>
    </div>
  );
}

  return (
    <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

      {/* HEADER */}
      {/* HEADER */}
<div className="text-center mb-6">
 <h1 className="text-4xl text-amber-400">
  Hair Accessories Collection
</h1>

  <p className="text-gray-500 text-sm italic mt-2">
    Luxury crafted for elegance
  </p>

  
</div>

<div className="md:hidden flex justify-between items-center mb-6">

  <button
    onClick={() => setShowFilters(true)}
    className="flex items-center gap-2 px-4 py-2 border border-amber-500/30 rounded-full text-amber-400 bg-zinc-900"
  >
    ☰ Filters
  </button>

  {/* SORT OPTIONS (ONLY MOBILE HERE) */}
  <div className="flex gap-2 text-[11px]">

    <button
      onClick={() => setSort("latest")}
      className={`px-3 py-1 rounded-full border ${
        sort === "latest"
          ? "bg-amber-500 text-black border-amber-500"
          : "border-white/10 text-gray-300"
      }`}
    >
      Latest
    </button>

    <button
      onClick={() => setSort("priceLow")}
      className={`px-3 py-1 rounded-full border ${
        sort === "priceLow"
          ? "bg-amber-500 text-black border-amber-500"
          : "border-white/10 text-gray-300"
      }`}
    >
      Low
    </button>

    <button
      onClick={() => setSort("priceHigh")}
      className={`px-3 py-1 rounded-full border ${
        sort === "priceHigh"
          ? "bg-amber-500 text-black border-amber-500"
          : "border-white/10 text-gray-300"
      }`}
    >
      High
    </button>

  </div>

</div>

{showFilters && (
  <>
    {/* BACKDROP */}
    <div
      className="fixed inset-0 bg-black/70 z-[998]"
      onClick={() => setShowFilters(false)}
    />

    {/* DRAWER */}
    <div
      className="
        fixed left-0 top-0
        w-[70%]
        max-w-[250px]
        h-screen
        bg-[#0b0b0b]
        border-r border-amber-500/20
        z-[999]
        overflow-y-auto
        p-5
        animate-[slideIn_.3s_ease]
      "
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl text-amber-400">
          Filters
        </h2>

        <button
          onClick={() => setShowFilters(false)}
          className="text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* MATERIAL */}
      <div>
  <h3 className="text-sm uppercase mb-3 text-amber-500 font-bold">
    Type
  </h3>

  {[
    "all",
    "bow",
    "clip",
    "scrunchie",
    "bun",
    "headband",
    "hairpin"
  ].map((item) => (
    <button
      key={item}
      onClick={() =>
        updateFilter("accessoryType", item)
      }
      className={`block text-sm mb-4 ${
        filters.accessoryType === item
          ? "text-amber-400 font-bold"
          : "text-gray-400"
      }`}
    >
      {item}
    </button>
  ))}
</div>

      {/* STYLE */}
      <div className="mb-8">
        <h3 className="text-amber-500 text-sm uppercase mb-3">
          Style
        </h3>

        {["all", "traditional", "modern", "casual"].map((item) => (
          <button
            key={item}
            onClick={() => {
              updateFilter("style", item);
              setShowFilters(false);
            }}
            className={`block text-sm mb-2 ${
              filters.style === item
                ? "text-amber-400 font-bold"
                : "text-gray-400"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* PRICE */}
      <div className="mb-8">
        <h3 className="text-amber-500 text-sm uppercase mb-3">
          Price
        </h3>

        {[
          { label: "All", value: "all" },
          { label: "Below ₹500", value: "below500" },
          { label: "₹500 - ₹1000", value: "500to1000" },
          { label: "Above ₹1000", value: "above1000" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => {
              updateFilter("price", item.value);
              setShowFilters(false);
            }}
            className={`block text-sm mb-2 ${
              filters.price === item.value
                ? "text-amber-400 font-bold"
                : "text-gray-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
  onClick={() => {
    clearAllFilters();
    setShowFilters(false);
  }}
  className="w-full py-3 bg-amber-500 text-black font-semibold rounded-xl"
>
  Clear Filters
</button>
    </div>
  </>
)}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* FILTERS */}
        <div className="hidden md:block space-y-8 sticky top-32 self-start">

          <div>
            <h3 className="text-sm uppercase mb-3 text-amber-500 font-bold">
              Type
            </h3>
            {[
    "all",
    "bow",
    "clip",
    "scrunchie",
    "bun",
    "headband",
    "hairpin"
  ].map((item) => (
              <button
                key={item}
                onClick={() => updateFilter("accessoryType", item)}
                className={`block text-sm mb-4 ${
                  filters.accessoryType === item
                    ? "text-amber-400 font-bold"
                    : "text-gray-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div>
           <h3 className="text-sm uppercase mb-3 text-amber-500 font-bold">
              Style
            </h3>
            {["all", "traditional", "modern", "casual"].map((item) => (
              <button
                key={item}
                onClick={() => updateFilter("style", item)}
                className={`block text-sm mb-4 ${
                  filters.style === item
                    ? "text-amber-400 font-bold"
                    : "text-gray-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div>
           <h3 className="text-sm uppercase mb-3 text-amber-500 font-bold">
              Price
            </h3>
            {[
              { label: "All", value: "all" },
              { label: "Below ₹500", value: "below500" },
              { label: "₹500 - ₹1000", value: "500to1000" },
              { label: "Above ₹1000", value: "above1000" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => updateFilter("price", item.value)}
               className={`block text-left text-sm mb-2 transition ${
                  filters.price === item.value
                    ? "text-amber-400 font-bold"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-400/80 hover:text-red-400 border-b border-red-400/20 pb-1"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* PRODUCTS */}
        <div className="md:col-span-3">

          {/* DESKTOP SORT */}
<div className="hidden md:flex justify-end mb-6 gap-3 text-xs uppercase">

  <button
    onClick={() => setSort("latest")}
    className={`px-4 py-2 rounded-full border transition ${
      sort === "latest"
        ? "bg-amber-500 text-black border-amber-500"
        : "border-white/20 text-gray-400 hover:text-amber-400 hover:border-amber-500"
    }`}
  >
    Latest
  </button>

  <button
    onClick={() => setSort("priceLow")}
    className={`px-4 py-2 rounded-full border transition ${
      sort === "priceLow"
        ? "bg-amber-500 text-black border-amber-500"
        : "border-white/20 text-gray-400 hover:text-amber-400 hover:border-amber-500"
    }`}
  >
    Low → High
  </button>

  <button
    onClick={() => setSort("priceHigh")}
    className={`px-4 py-2 rounded-full border transition ${
      sort === "priceHigh"
        ? "bg-amber-500 text-black border-amber-500"
        : "border-white/20 text-gray-400 hover:text-amber-400 hover:border-amber-500"
    }`}
  >
    High → Low
  </button>

</div>
          {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {sortedItems.map((item) => (
             <div
  key={item._id}
  className="border border-white/10 p-4 rounded-xl bg-zinc-900/50 hover:border-amber-500/30 transition cursor-pointer flex flex-col h-full"
  onClick={() => openModal(item)}
>
               <img
  src={getImage(item.image)}
  className="aspect-[4/5] w-full object-cover rounded-lg"
/>

                <h3 className="text-white mt-4 font-medium line-clamp-2 min-h-[48px]">
                  {item.name}
                </h3>

<p className="text-amber-500 text-xs uppercase tracking-wider mt-1">
  ID: {item.productId}
</p>

                <p className="text-gray-400 text-sm mt-1 line-clamp-2 min-h-[40px]">
  {item.description || "Premium luxury earring collection"}
</p>

                <p className="text-2xl text-amber-400 mt-2">
                  ₹{item.price}
                </p>

                {/* ✅ ADDED BUTTONS */}
                <div className="mt-auto pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(item);
                    }}
                    className="w-full bg-amber-500 text-black font-bold px-4 py-2 rounded hover:bg-amber-400 transition"
                  >
                    Buy Now
                  </button>

                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-start justify-center pt-20 pb-10 px-3 overflow-y-auto"
          onClick={closeModal}
        >
          <div
           className="relative w-full max-w-3xl rounded-[1.5rem] overflow-hidden border border-white/10 bg-[#111111]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* GOLD GLOW */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_35%)] pointer-events-none"></div>
      
            {/* CLOSE BUTTON */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-gray-300 hover:text-amber-400 hover:border-amber-500 transition-all duration-300"
            >
              ✕
            </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2">        
              
       {/* IMAGE SIDE */}
      <div className="relative bg-black h-full min-h-[480px] overflow-hidden">
        <img
          src={
            selectedProduct.image.startsWith("http")
              ? selectedProduct.image
              : `${API_URL}${selectedProduct.image}`
          }
          className="w-full h-full object-cover object-center"
          alt={selectedProduct.name}
        />
      
        {/* IMAGE OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      
        {/* LUXURY BADGE */}
        <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-md text-amber-300 text-xs uppercase tracking-[0.3em]">
          Premium Collection
        </div>
      </div>
      
              {/* CONTENT SIDE */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                
                {/* CATEGORY */}
                <p className="text-xs uppercase tracking-[0.4em] text-amber-500 mb-4">
                  LOLAKK Luxury
                </p>
      
                {/* TITLE */}
                <h2 className="text-3xl md:text-4xl serif text-white leading-tight">
                  {selectedProduct.name}
                </h2>
      
                {/* DESCRIPTION */}
                <p className="text-gray-400 leading-relaxed mt-6 text-sm md:text-base">
                  {selectedProduct.description ||
                    "A timeless handcrafted luxury ring designed with elegance and sophistication for modern beauty."}
                </p>
      
                {/* PRICE */}
                <div className="mt-8 flex items-end gap-3">
                  <span className="text-4xl font-light text-amber-400 tracking-wide">
                    ₹{selectedProduct.price}
                  </span>
      
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500 pb-2">
                    Exclusive Price
                  </span>
                </div>
      
                {/* BUTTONS */}
                <div className="mt-8 space-y-3">
                  
                  {/* ADD TO CART */}
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="relative overflow-hidden group w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black font-semibold tracking-wide shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:shadow-[0_0_40px_rgba(251,191,36,0.45)] transition-all duration-500"
                  >
                    <span className="absolute top-0 left-[-120%] h-full w-[50%] bg-white/30 skew-x-[-20deg] group-hover:left-[130%] transition-all duration-1000"></span>
      
                    <span className="relative flex items-center justify-center gap-3 uppercase tracking-[0.25em] text-sm">
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </span>
                  </button>
      
                  {/* GO TO CART */}
                  <button
                    onClick={() => (window.location.href = "/cart")}
                    className="w-full py-3.5 rounded-2xl border border-amber-500/30 bg-white/5 backdrop-blur-md text-amber-300 uppercase tracking-[0.25em] text-sm hover:bg-amber-500 hover:text-black transition-all duration-500"
                  >
                    Go to Cart
                  </button>
                </div>
      
                {/* EXTRA DETAILS */}
                <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-amber-400 text-lg">✦</p>
                    <p className="text-xs text-gray-500 mt-1">Premium Quality</p>
                  </div>
      
                  <div>
                    <p className="text-amber-400 text-lg">✦</p>
                    <p className="text-xs text-gray-500 mt-1">Luxury Finish</p>
                  </div>
      
                  <div>
                    <p className="text-amber-400 text-lg">✦</p>
                    <p className="text-xs text-gray-500 mt-1">Elegant Design</p>
                  </div>
                </div>
              </div>
            </div>
      
            {/* SIMILAR PRODUCTS */}
            {similarProducts.length > 0 && (
              <div className="border-t border-white/10 px-6 md:px-8 py-6 bg-white/[0.02]">
                <h3 className="text-sm uppercase tracking-[0.3em] text-amber-400 mb-6">
                  Similar Products
                </h3>
      
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {similarProducts.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setSelectedProduct(item)}
                      className="group cursor-pointer"
                    >
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                        <img
                          src={
                            item.image.startsWith("http")
                              ? item.image
                              : `${API_URL}${item.image}`
                          }
                          className="h-40 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={item.name}
                        />
                      </div>
      
                      <p className="text-sm text-gray-300 mt-3 group-hover:text-amber-400 transition">
                        {item.name}
                      </p>
      
                      <p className="text-amber-500 text-sm mt-1">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* NOTIFICATION */}
      {/* NOTIFICATION */}
{notification && (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-3 border border-amber-500 z-[1000] flex items-center gap-4 rounded-lg">
    
    <span>{notification.message}</span>

    <button
      onClick={() => (window.location.href = "/cart")}
      className="bg-amber-500 text-black px-3 py-1 rounded-md text-xs hover:bg-amber-400 transition"
    >
      Go to Cart
    </button>
  </div>
)}
    </section>
  );
}