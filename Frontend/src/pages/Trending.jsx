import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const INITIAL_FILTERS = {
  category: "all",
  price: "all",
};

export default function Trending() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState("popular");

  

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [cart, setCart] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  // FETCH ONLY TRENDING FROM BACKEND
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);

        const trendingItems = res.data.filter(
          (p) => p.trending === true
        );

        setProducts(trendingItems);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchTrending();
  }, []);

  // FIX IMAGE PATH
  const getImage = (img) => {
    if (!img) return "/placeholder.jpg";
    if (img.startsWith("http")) return img;
    return `${API_URL}${img}`;
  };

 const updateFilter = (key, value) => {
  setFilters({ ...filters, [key]: value });
};

  const clearAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSort("popular");
 
  };

  const isFiltered =
    filters.category !== "all" || filters.price !== "all" || sort !== "popular";

  // FILTER LOGIC (FIXED: uses "type" from backend)
  const filtered = products.filter((item) => {
  return (
    (filters.category === "all" || item.type === filters.category) &&
    (filters.price === "all" ||
      (filters.price === "low" && item.price < 500) ||
      (filters.price === "mid" &&
        item.price >= 500 &&
        item.price <= 1000) ||
      (filters.price === "high" && item.price > 1000))
  );
});

  // SORT LOGIC
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "priceLow") return a.price - b.price;
    if (sort === "priceHigh") return b.price - a.price;
    if (sort === "latest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

 const similarProducts = selectedProduct
  ? products.filter(
      (item) =>
        item.type === selectedProduct.type &&
        item._id !== selectedProduct._id
    )
  : [];

  

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
  setShowModal(false);
  setSelectedProduct(null);
};

 const addToCart = (product) => {
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
    id: product._id,
    name: product.name,
    price: product.price,
    image: getImage(product.image),
    qty: 1,
  };

  const index = currentCart.findIndex(
    (item) => item.id === product._id
  );

  let updatedCart;

  if (index > -1) {
    updatedCart = [...currentCart];
    updatedCart[index].qty += 1;
  } else {
    updatedCart = [...currentCart, cartItem];
  }

  localStorage.setItem(
    `lolakk_cart_${userId}`,
    JSON.stringify(updatedCart)
  );

  setCart(updatedCart);

  setNotification({
    message: `${product.name} added to cart!`,
  });

  setTimeout(() => {
    setNotification(null);
  }, 3000);
};
  // LOADER VIEW
  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-64 h-64 flex flex-col items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-900/20 blur-3xl transform scale-75 animate-[softGlow_4s_ease-in-out_infinite]"></div>
          <div className="relative z-10 w-32 h-32 text-amber-400/90 animate-[iconBreathe_3s_ease-in-out_infinite]">
            <svg viewBox="0 0 100 100" fill="currentColor" className="drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]">
              <defs>
                <linearGradient id="handGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
              <path
                fill="url(#handGradient)"
                d="M50 10 C 55 25, 65 35, 65 55 C 65 75, 55 85, 50 90 C 45 85, 35 75, 35 55 C 35 35, 45 25, 50 10 Z M50 20 C 52 30, 58 38, 58 55 C 58 68, 54 75, 50 80 C 46 75, 42 68, 42 55 C 42 38, 48 30, 50 20 Z"
              />
              <rect x="49.5" y="15" width="1" height="70" fill="#fef3c7" opacity="0.5" />
            </svg>
          </div>
          <div className="mt-6 relative z-10">
            <h2 className="text-3xl md:text-4xl serif gold-gradient tracking-[0.25em] mb-1">LOLAKK</h2>
            <p className="text-gray-400 italic font-light text-sm tracking-wide">by Athira</p>
          </div>
        </div>
        <div className="mt-12 w-48 h-[1px] bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-amber-500 animate-[progressBar_2.5s_linear_forwards]"></div>
        </div>
        <style jsx>{`
          @keyframes softGlow { 0%, 100% { opacity: 0.5; transform: scale(0.75); } 50% { opacity: 1; transform: scale(1); } }
           @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  .serif {
    font-family: 'Playfair Display', serif;
  }
          @keyframes iconBreathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.03); opacity: 1; } }
          @keyframes progressBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(0%); } }
          .serif { font-family: 'Playfair Display', serif; }
          .gold-gradient { background: linear-gradient(to right, #fbbf24, #fef3c7, #b45309); -webkit-background-clip: text; background-clip: text; color: transparent; }
        `}</style>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

      {/* TITLE */}
     <div className="text-center mb-6">
        <h1 className="text-4xl text-amber-400">Customer Favorites</h1>
        <p className="text-gray-500 text-sm italic mt-2">Luxury crafted for elegance</p>
      </div>

      {/* MOBILE FILTER BUTTON */}
<div className="md:hidden flex justify-between items-center mb-6">

  {/* FILTER BUTTON */}
  <button
    onClick={() => setShowFilters(true)}
    className="flex items-center gap-2 px-4 py-2 border border-amber-500/30 rounded-full text-amber-400 bg-zinc-900"
  >
    ☰ Filters
  </button>

  {/* SORT OPTIONS */}
  <div className="flex gap-2 text-[11px]">

    <button
      onClick={() => setSort("popular")}
      className={`px-3 py-1 rounded-full border ${
        sort === "popular"
          ? "bg-amber-500 text-black border-amber-500"
          : "border-white/10 text-gray-300"
      }`}
    >
      Popular
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

     {/* MOBILE FILTERS */}
{showFilters && (
  <>
    {/* BACKDROP */}
    <div
      className="fixed inset-0 bg-black/70 z-[998]"
      onClick={() => setShowFilters(false)}
    />

    {/* DRAWER */}
    <div className="
  fixed left-0 top-0
  w-[55%] max-w-[200px]
  h-screen
  bg-[#0b0b0b]
  border-r border-amber-500/20
  z-[999]
  overflow-y-auto
  p-4
  animate-[slideIn_.3s_ease]
">

      {/* HEADER */}
     <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-amber-400 serif">Filters</h2>

        <button
          onClick={() => setShowFilters(false)}
          className="text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* CATEGORY */}
      <div className="mb-6">
        <h3 className="text-amber-500 text-sm uppercase mb-3">
          Category
        </h3>

        {["all", "rings", "earrings", "necklaces", "bracelets", "kids", "rentals"].map((item) => (
          <button
            key={item}
            onClick={() => {
              updateFilter("category", item);
              setShowFilters(false);
            }}
            className={`block text-sm mb-2 ${
              filters.category === item
                ? "text-amber-400 font-bold"
                : "text-gray-400"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* PRICE */}
      <div className="mb-6">
        <h3 className="text-amber-500 text-sm uppercase mb-3">
          Price
        </h3>

        {[
          { label: "All", value: "all" },
          { label: "Below ₹500", value: "low" },
          { label: "₹500 - ₹1000", value: "mid" },
          { label: "Above ₹1000", value: "high" },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => {
              updateFilter("price", p.value);
              setShowFilters(false);
            }}
            className={`block text-sm mb-2 ${
              filters.price === p.value
                ? "text-amber-400 font-bold"
                : "text-gray-400"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* CLEAR FILTERS (MATCH RINGS STYLE) */}
      {isFiltered && (
        <button
           onClick={() => {
    clearAllFilters();
    setShowFilters(false);
  }}
          className="
            w-full py-3
            bg-amber-500
            text-black
            font-semibold
            rounded-xl
          "
        >
          Clear Filters
        </button>
      )}
    </div>
  </>
)}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* SIDEBAR FILTER */}
         <div className="hidden md:block space-y-8 sticky top-32 h-fit">

          {/* CATEGORY */}
          <div>
            <h3 className="text-sm uppercase mb-4 text-amber-500">
              Category
            </h3>

            {["all", "rings", "earrings", "necklaces", "bracelets","kids","rentals"].map((item) => (
              <button
                key={item}
                onClick={() => updateFilter("category", item)}
                className={`block mb-3 text-sm ${
                  filters.category === item
                    ? "text-amber-400 font-bold"
                    : "text-gray-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* PRICE */}
          <div>
            <h3 className="text-sm uppercase mb-4 text-amber-500">
              Price
            </h3>

            {[
  { label: "All", value: "all" },
  { label: "Below ₹500", value: "low" },
  { label: "₹500 - ₹1000", value: "mid" },
  { label: "Above ₹1000", value: "high" },
].map((p) => (
              <button
                key={p.value}
                onClick={() => updateFilter("price", p.value)}
                className={`block mb-3 text-sm ${
                  filters.price === p.value
                    ? "text-amber-400 font-bold"
                    : "text-gray-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* CLEAR */}
          {isFiltered && (
            <button
              onClick={clearAllFilters}
              className="text-red-400 text-xs uppercase"
            >
              Clear Filters
            </button>
          )}
        </div>

   

        {/* PRODUCTS */}
        <div className="md:col-span-3">

          {/* SORT */}
          <div className="hidden md:flex justify-end gap-4 mb-8">
            {/* <p className="text-gray-500 text-sm">
              {sorted.length} products
            </p> */}

           <div className="flex flex-wrap gap-2 text-xs justify-end">
              {[
                { label: "Popular", value: "popular" },
                { label: "Latest", value: "latest" },
                { label: "Low", value: "priceLow" },
                { label: "High", value: "priceHigh" },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={`px-3 py-1 border rounded ${
                    sort === s.value
                      ? "bg-amber-500 text-black"
                      : "text-gray-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* GRID */}
         <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {sorted.map((item) => (
              <div
                key={item._id}
                onClick={() => openModal(item)}
               className="border border-white/10 p-3 rounded-xl bg-zinc-900/50 hover:border-amber-500/30 transition cursor-pointer"
              >
               <img
  src={getImage(item.image)}
  className="h-36 sm:h-44 md:h-48 w-full object-cover rounded-lg"
/>

               <div className="pt-3">
                  <h3 className="text-white">{item.name}</h3>
                  <p className="text-amber-400">₹{item.price}</p>
                </div>
                {/* BUY NOW BUTTON */}
    <div className="mt-3">
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

          

        </div>
      </div>

    </section>
  );
}