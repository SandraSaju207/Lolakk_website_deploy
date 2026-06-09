import { useState, useEffect } from "react";

const INITIAL_FILTERS = {
  price: "all",
  occasion: "all",
};

export default function Gifting() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState("latest");

  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Simulate loading effect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const gifts = [
    {
      id: 1,
      name: "Minimal Gold Pendant",
      price: 12000,
      occasion: "birthday",
      tag: "Best Seller",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
    },
    {
      id: 2,
      name: "Diamond Stud Earrings",
      price: 28000,
      occasion: "anniversary",
      tag: "Premium",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338",
    },
    {
      id: 3,
      name: "Gold Bracelet",
      price: 18000,
      occasion: "festival",
      tag: "Trending",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
    },
    {
      id: 4,
      name: "Solitaire Ring",
      price: 65000,
      occasion: "proposal",
      tag: "Luxury",
      image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36",
    },
  ];

  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSort("latest");
    setCurrentPage(1);
  };

  const isFiltered =
    filters.price !== "all" ||
    filters.occasion !== "all" ||
    sort !== "latest";

  const filtered = gifts.filter((item) => {
    return (
      (filters.occasion === "all" || item.occasion === filters.occasion) &&
      (filters.price === "all" ||
        (filters.price === "low" && item.price < 20000) ||
        (filters.price === "mid" &&
          item.price >= 20000 &&
          item.price <= 40000) ||
        (filters.price === "high" && item.price > 40000))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "priceLow") return a.price - b.price;
    if (sort === "priceHigh") return b.price - a.price;
    return b.id - a.id;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sorted.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

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
              <path fill="url(#handGradient)" d="M50 10 C 55 25, 65 35, 65 55 C 65 75, 55 85, 50 90 C 45 85, 35 75, 35 55 C 35 35, 45 25, 50 10 Z M50 20 C 52 30, 58 38, 58 55 C 58 68, 54 75, 50 80 C 46 75, 42 68, 42 55 C 42 38, 48 30, 50 20 Z" />
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
          @keyframes iconBreathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.03); opacity: 1; } }
          @keyframes progressBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(0%); } }
          .serif { font-family: 'Playfair Display', serif; }
          .gold-gradient { background: linear-gradient(to right, #fbbf24, #fef3c7, #b45309); -webkit-background-clip: text; background-clip: text; color: transparent; }
        `}</style>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative z-0">
      <style jsx>{`
        .serif { font-family: "Playfair Display", serif; }
        .gold-gradient {
          background: linear-gradient(to right, #fbbf24, #fef3c7, #b45309);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); }
      `}</style>

      {/* HERO */}
      <div className="text-center mb-16">
        <h1 className="text-4xl serif gold-gradient mb-3">Find the Perfect Gift</h1>
        <p className="text-gray-500 italic text-sm">Celebrate life's precious milestones</p>
      </div>

      {/* OCCASION CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { label: "Birthday", value: "birthday", desc: "For their special day" },
          { label: "Anniversary", value: "anniversary", desc: "Years of love" },
          { label: "Festival", value: "festival", desc: "Sparkle in tradition" },
          { label: "Proposal", value: "proposal", desc: "A forever promise" },
        ].map((item) => (
          <div
            key={item.value}
            onClick={() => updateFilter("occasion", item.value)}
            className={`cursor-pointer group relative p-8 rounded-2xl border overflow-hidden transition duration-500 ${
              filters.occasion === item.value
                ? "border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                : "border-white/10 glass hover:border-amber-400/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
            <h3 className={`serif text-xl mb-1 ${filters.occasion === item.value ? "text-amber-400" : "text-white"}`}>
              {item.label}
            </h3>
            <p className="text-xs text-gray-500 group-hover:text-gray-300 transition">{item.desc}</p>
            <div className={`absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-500 ${filters.occasion === item.value ? "w-full" : "w-0"}`}></div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-4 gap-10">
        {/* SIDEBAR */}
        <div className="space-y-8">
          <div>
            <h3 className="text-sm uppercase mb-4 text-amber-500 font-semibold tracking-wider">Budget</h3>
            {[
              { label: "All Prices", value: "all" },
              { label: "Under ₹20K", value: "low" },
              { label: "₹20K - ₹40K", value: "mid" },
              { label: "Above ₹40K", value: "high" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => updateFilter("price", p.value)}
                className={`block text-sm mb-3 transition ${filters.price === p.value ? "text-amber-400 pl-3 border-l-2 border-amber-500 font-bold" : "text-gray-400 hover:text-white hover:pl-2"}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button onClick={clearAllFilters} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-400/80 hover:text-red-400 transition-all border-b border-red-400/20 pb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              Clear All Filters
            </button>
          )}
        </div>

        {/* PRODUCTS SECTION */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-xs text-gray-500 font-light">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sorted.length)} of {sorted.length} gifts
            </p>
            <div className="flex gap-3 text-xs uppercase">
              {[{ label: "Latest", value: "latest" }, { label: "Low → High", value: "priceLow" }, { label: "High → Low", value: "priceHigh" }].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={`px-3 py-1 border rounded-full transition ${sort === s.value ? "bg-amber-500 text-black border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]" : "border-white/20 text-gray-400 hover:border-amber-400 hover:text-amber-400"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {paginatedItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {paginatedItems.map((item) => (
                  <div key={item.id} className="group relative rounded-2xl glass border border-white/10 overflow-hidden transition duration-500 hover:border-amber-500/30">
                    <div className="relative h-[300px] overflow-hidden">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" alt={item.name} />
                      
                      {/* OVERLAY ACTIONS */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                        <button className="p-4 rounded-full bg-amber-500 text-black hover:bg-amber-400 transform translate-y-8 group-hover:translate-y-0 transition duration-500 shadow-2xl">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                          </svg>
                        </button>
                        <button className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 transform translate-y-8 group-hover:translate-y-0 transition duration-500 delay-75">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                          </svg>
                        </button>
                      </div>

                      {item.tag && (
                        <span className="absolute top-4 right-4 text-[9px] uppercase bg-black/70 backdrop-blur-md text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 tracking-widest z-10">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="serif text-lg text-white group-hover:text-amber-300 transition">{item.name}</h3>
                      <p className="text-amber-500 font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION UI */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full border border-white/10 transition ${currentPage === 1 ? "opacity-20 cursor-not-allowed" : "hover:border-amber-500 text-amber-500"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-full text-xs transition-all duration-300 ${currentPage === i + 1 ? "bg-amber-500 text-black font-bold" : "border border-white/5 text-gray-400 hover:border-amber-500"}`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full border border-white/10 transition ${currentPage === totalPages ? "opacity-20 cursor-not-allowed" : "hover:border-amber-500 text-amber-500"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl mt-10">
              <p className="text-gray-500 serif italic">No gifts match your selection.</p>
              <button onClick={clearAllFilters} className="mt-4 text-amber-500 text-sm underline">Reset filters</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}