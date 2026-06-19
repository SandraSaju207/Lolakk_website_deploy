import { useState, useEffect } from "react";
import jsPDF from "jspdf"; 
import QRCode from "qrcode";
import axios from "axios";

// ✅ BASE URL CONFIGURATION
const API = import.meta.env.VITE_API_URL;

const INITIAL_FILTERS = {
  category: "all",
  length: "all",
  price: "all",
  type: "all",
  duration: "all",
};

export default function Rental() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]); 
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState("latest");

  //const [currentPage, setCurrentPage] = useState(1);
  //const itemsPerPage = 6;

  // RENTAL STATES
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [customerName, setCustomerName] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // ✅ BACKEND DATA FETCHING
  useEffect(() => {
    const fetchProducts = async () => {
      try {
       const response = await axios.get(`${API}/api/products`);

const data = response?.data;

if (!Array.isArray(data)) {
  console.error("API ERROR: Expected array but got:", data);
  setItems([]);
  setLoading(false);
  return;
}

const rentalData = data.filter(
  p => (p.type || "").toLowerCase().trim().includes("rent")
);

const formattedData = rentalData.map((p) => ({
  id: p._id,
  name: p.name,
  rent: Number(p.price || 0),

category: (p.materialType ?? "").toString().toLowerCase().trim(),
type: (p.style ?? "").toString().toLowerCase().trim(),

  duration: ["1", "3", "7", "15"],
  image: p.image?.startsWith("http")
    ? p.image
    : `${API}/${p.image}`,

  createdAt: p.createdAt,
}));

setItems(formattedData);
setTimeout(() => setLoading(false), 2500);
        
        
      } catch (err) {
        console.error("Connection Error:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ FIXED RETURN DATE
  useEffect(() => {
    if (startDate && duration) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + Number(duration));
      setReturnDate(date.toISOString().split("T")[0]);
    } else {
      setReturnDate("");
    }
  }, [startDate, duration]);

  const isFiltered = JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS) || sort !== "latest";

  const clearAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSort("latest");
    //setCurrentPage(1);
  };

const filteredItems = items.filter((item) => {
  const rent = Number(item.rent || 0);

  const matchCategory =
    filters.category === "all" ||
    item.category?.toLowerCase() === filters.category.toLowerCase();

  const matchType =
    filters.type === "all" ||
    item.type?.toLowerCase() === filters.type.toLowerCase();

  const matchDuration =
    filters.duration === "all" ||
    item.duration?.map(String).includes(String(filters.duration));

  const matchPrice =
    filters.price === "all" ||
    (filters.price === "low" && rent < 1500) ||
    (filters.price === "mid" && rent >= 1500 && rent <= 2000) ||
    (filters.price === "high" && rent > 2000);

  return matchCategory && matchType && matchDuration && matchPrice;
});

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sort === "priceLow") return a.rent - b.rent;
    if (sort === "priceHigh") return b.rent - a.rent;
    if (sort === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

 /* const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);*/

  const updateFilter = (key, value) => {
  setFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
};

 /* const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };*/

 const openModal = (item) => {
  const token = localStorage.getItem("token");

  if (!token) {
    localStorage.setItem(
      "redirectAfterLogin",
      window.location.pathname
    );

    window.location.href = "/login";
    return;
  }

  setSelectedItem(item);
  setShowModal(true);
};
  const closeModal = () => {
    setShowModal(false);
    setStartDate("");
    setDuration("");
    setReturnDate("");
    setCustomerName(""); 
  };

  // ✅ PDF GENERATOR (FIXED WITH ROBUST CORS FETCH)
 // ✅ RECEIPT PDF GENERATOR
const generatePDF = async (data) => {
  const doc = new jsPDF();

  const getBase64FromUrl = async (url) => {
    try {
      const res = await fetch(url, {
        mode: "cors",
        cache: "no-cache",
      });

      const blob = await res.blob();

      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

    } catch (error) {
      console.log("Image error:", error);
      return null;
    }
  };

  try {
    const imageBase64 = await getBase64FromUrl(data.image);

    // =========================
    // HEADER
    // =========================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(212, 175, 55);

    doc.text("LOLAKK", 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(120);

    doc.text("Premium Jewellery Rentals", 20, 28);

    doc.setDrawColor(212, 175, 55);
    doc.line(20, 34, 190, 34);

    // =========================
    // CUSTOMER DETAILS
    // =========================

    doc.setFontSize(12);
    doc.setTextColor(0);

    doc.text(`Customer Name: ${data.customerName}`, 20, 50);
    doc.text(`Rental ID: ${data.rentalId}`, 20, 60);
    doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 20, 70);

    // =========================
    // PRODUCT IMAGE
    // =========================

    if (imageBase64) {
      doc.addImage(imageBase64, "JPEG", 135, 45, 50, 50);
    }

    // =========================
    // RENTAL DETAILS
    // =========================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text("Rental Details", 20, 100);

    doc.setLineWidth(0.3);
    doc.line(20, 104, 190, 104);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`Product Name: ${data.item}`, 20, 118);

    doc.text(`Rental Start Date: ${data.startDate}`, 20, 130);

    doc.text(`Return Date: ${data.returnDate}`, 20, 142);

    doc.text(`Rental Duration: ${data.duration} Days`, 20, 154);

    doc.text(`Rental Amount: ₹${data.total}`, 20, 166);

    // =========================
    // IMPORTANT MESSAGE
    // =========================

    doc.setFillColor(255, 248, 220);
    doc.rect(20, 180, 170, 30, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(212, 175, 55);

    doc.text("Important", 25, 192);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);

    doc.text(
      "Please visit our shop directly to collect",
      25,
      202
    );

    doc.text(
      "your rented jewellery item.",
      25,
      210
    );

    // =========================
    // FOOTER
    // =========================

    doc.setFontSize(10);

    doc.text(
      "LOLAKK Jewellery Rentals - Kerala, India",
      20,
      240
    );

    doc.text(
      "Thank you for choosing us!",
      20,
      248
    );

    // =========================
    // SAVE PDF
    // =========================

    doc.save(`LOLAKK_Receipt_${data.rentalId}.pdf`);

  } catch (error) {
    console.log("PDF Error:", error);
  }
};

  // ✅ CONFIRM ACTION
 // ✅ CONFIRM ACTION
const handleConfirm = async () => {
  if (!startDate || !duration || !customerName) return;

  const rentalTotal = selectedItem.rent * Number(duration);

  try {
    // ✅ Save booking in database
    const response = await axios.post("/api/rentals", {
      customerName,
      itemName: selectedItem.name,
      rentalPeriod: {
        start: startDate,
        end: returnDate
      },
      total: rentalTotal,

      // ✅ FIXED STATUS
      status: "Rental Order Accepted"
    });

    const rentalId = response.data.rentalId;

    // ✅ Generate receipt PDF
    await generatePDF({
      customerName,
      rentalId,
      item: selectedItem.name,
      startDate,
      duration,
      returnDate,
      total: rentalTotal,
      image: selectedItem.image,
    });

    // =========================
// ADD RENTAL ITEM TO CART
// =========================

const userId = localStorage.getItem("userId");

const existingCart =
  JSON.parse(
    localStorage.getItem(`lolakk_cart_${userId}`)
  ) || [];

const rentalCartItem = {
  id: selectedItem.id,
  name: selectedItem.name,
  image: selectedItem.image,

  // IMPORTANT
  price: selectedItem.rent,

  qty: 1,

  // RENTAL FLAG
  isRental: true,

  // EXTRA RENTAL DETAILS
  rentalDuration: duration,
  rentalStartDate: startDate,
  rentalReturnDate: returnDate,
};

// existingCart.push(rentalCartItem);

localStorage.setItem(
  `lolakk_cart_${userId}`,
  JSON.stringify(existingCart)
);

   setSuccessMessage(
  "Booking confirmed successfully! Your rental receipt has been downloaded. Please visit our shop directly to collect your jewellery."
);

setTimeout(() => {
  setSuccessMessage("");
}, 5000);
    closeModal();

  } catch (err) {
    console.error("Booking Error:", err.response?.data || err.message);

    alert(
      err.response?.data?.message ||
      "Booking failed. Check console."
    );
  }
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
        <style>{`
          @keyframes softGlow { 0%, 100% { opacity: 0.5; transform: scale(0.75); } 50% { opacity: 1; transform: scale(1); } }
          @keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
          @keyframes iconBreathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.03); opacity: 1; } }
          @keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
          @keyframes progressBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(0%); } }
          .serif { font-family: 'Playfair Display', serif; }
          .gold-gradient { background: linear-gradient(to right, #fbbf24, #fef3c7, #b45309); -webkit-background-clip: text; background-clip: text; color: transparent; }
        `}</style>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl text-amber-400">Jewellery Rentals</h1>
         <p className="text-gray-500 text-sm italic mt-2">Luxury crafted for elegance</p>
      </div>

{/* MOBILE FILTER BUTTON */}
 <div className="md:hidden flex justify-between items-center mb-6">

  <button
    onClick={() => setMobileFilterOpen(true)}
   className="flex items-center gap-2 px-4 py-2 border border-amber-500/30 rounded-full text-amber-400 bg-zinc-900"
  >
    ☰ Filters
  </button>

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
      <div className="hidden md:block space-y-8 sticky top-32 self-start">
         <div>
  <h3 className="text-sm uppercase mb-3 text-amber-500 font-semibold tracking-wider">
    Category
  </h3>

  {["all", "gold", "diamond", "gemstone"].map((item) => (
    <button
      key={item}
      onClick={() => updateFilter("category", item)}
      className={`block text-left text-sm mb-2 ${
        filters.category === item
          ? "text-amber-400 font-medium"
          : "text-gray-400 hover:text-amber-400"
      }`}
    >
      {item}
    </button>
  ))}
</div>

          <div>
            <h3 className="text-sm uppercase mb-3 text-amber-500 font-semibold tracking-wider">Product Type</h3>
            {["all", "traditional", "modern", "casual"].map((item) => (
              <button key={item} onClick={() => updateFilter("type", item)} className={`block text-left text-sm mb-2 ${filters.type === item ? "text-amber-400 font-medium" : "text-gray-400 hover:text-amber-400"}`}>
                {item}
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-sm uppercase mb-3 text-amber-500 font-semibold tracking-wider">Price</h3>
            {[
              { label: "All", value: "all" },
              { label: "Under ₹1500", value: "low" },
              { label: "₹1500 - ₹2000", value: "mid" },
              { label: "Above ₹2000", value: "high" },
            ].map((p) => (
              <button key={p.value} onClick={() => updateFilter("price", p.value)} className={`block text-left text-sm mb-2 ${filters.price === p.value ? "text-amber-400 font-medium" : "text-gray-400 hover:text-amber-400"}`}>
                {p.label}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button onClick={clearAllFilters} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-400/80 hover:text-red-400 transition-all border-b border-red-400/20 pb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
              Clear All Filters
            </button>
          )}
        </div>

        <div className="md:col-span-3">
          {/* SORT UI */}
{/* <div className="hidden md:flex justify-end mb-6">

  <button
    onClick={() => setSort("latest")}
    className={`px-3 py-1 rounded-full border ${
      sort === "latest"
        ? "bg-amber-500 text-black"
        : "border-white/10 text-gray-300"
    }`}
  >
    Latest
  </button>

  <button
    onClick={() => setSort("priceLow")}
    className={`px-3 py-1 rounded-full border ${
      sort === "priceLow"
        ? "bg-amber-500 text-black"
        : "border-white/10 text-gray-300"
    }`}
  >
    Low
  </button>

  <button
    onClick={() => setSort("priceHigh")}
    className={`px-3 py-1 rounded-full border ${
      sort === "priceHigh"
        ? "bg-amber-500 text-black"
        : "border-white/10 text-gray-300"
    }`}
  >
    High
  </button>

</div> */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 gap-8">
            {sortedItems.map((item) => (
              <div key={item.id} className="border border-white/10 p-3 md:p-4 rounded-xl bg-zinc-900/50 hover:border-amber-500/30 transition-all group">
                <div className="overflow-hidden rounded-xl">
  <img
  src={item.image}
   className="h-48 md:h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
/>
</div>
               
  
<div className="mt-3 flex flex-col gap-2">
  <div className="flex justify-between items-center">
    <span className="text-2xl text-amber-400 font-light">
      ₹{item.rent}
    </span>

    <span className="text-[11px] text-gray-500 uppercase">
      Rental Price
    </span>
  </div>
  </div>
                <button onClick={() => openModal(item)} className="mt-4 w-full bg-amber-500 text-black font-bold px-4 py-2 rounded hover:bg-amber-400 transition transform active:scale-95">
                  Book Now
                </button>
              </div>
            ))}
          </div>

          {/*totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => handlePageChange(i + 1)} className={`w-8 h-8 rounded flex items-center justify-center transition ${currentPage === i+1 ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )*/}
        </div>
      </div>

      {/* SUCCESS MESSAGE */}

{successMessage && (
  <div className="fixed top-6 right-6 z-[200] bg-black border border-amber-500 text-white px-5 py-4 rounded-xl shadow-2xl max-w-sm animate-fadeIn">
    
    <h3 className="text-amber-400 font-bold text-sm mb-1">
      Booking Confirmed
    </h3>

    <p className="text-sm text-gray-300 leading-relaxed">
      {successMessage}
    </p>

  </div>
)}

      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] backdrop-blur-sm">
          <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-sm border border-white/10 shadow-2xl">
            <h2 className="text-amber-400 mb-4 font-serif text-xl border-b border-white/5 pb-2">{selectedItem.name}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase text-gray-500 ml-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 bg-black border border-white/10 text-white rounded outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-gray-500 ml-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 bg-black border border-white/10 text-white rounded outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-gray-500 ml-1">Select Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {selectedItem.duration.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`py-2 text-xs border rounded transition ${
                        duration === d ? "bg-amber-500 border-amber-500 text-black font-bold" : "border-white/10 text-gray-400 hover:border-amber-500/50"
                      }`}
                    >
                      {d}D
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {returnDate && (
              <div className="mt-4 p-3 bg-amber-500/5 rounded border border-amber-500/20">
                <p className="text-amber-400 text-xs flex justify-between">
                  <span>Return Date:</span> 
                  <span className="font-bold">{returnDate}</span>
                </p>
                {/* <p className="text-white text-sm flex justify-between mt-1">
                  <span>Estimated Total:</span>
                  <span className="font-bold">₹{selectedItem.rent * duration}</span>
                </p>  */}
              </div>
            )}

            <div className="flex justify-between items-center mt-8">
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition text-sm">Cancel</button>
              <button
                onClick={handleConfirm}
              disabled={!startDate || !duration || !customerName || !selectedItem}
                className={`px-6 py-2 rounded font-bold transition ${
                  !startDate || !duration || !customerName ? "bg-zinc-700 text-zinc-500 cursor-not-allowed" : "bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {mobileFilterOpen && (
  <div className="fixed inset-0 z-[999] bg-black/70 flex">
  <div className="w-[75%] max-w-xs h-full bg-zinc-900 p-5 overflow-y-auto animate-slideIn">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-amber-400 font-bold">Filters</h2>

       <button
  onClick={() => setMobileFilterOpen(false)}
  className="text-gray-400 hover:text-white text-xl"
>
  ✕
</button>
      </div>

      {/* FILTER CONTENT (COPY FROM YOUR SIDEBAR) */}
      
      <div className="space-y-8">

        {/* CATEGORY */}
        <div>
          <h3 className="text-sm uppercase mb-3 text-amber-500 font-semibold tracking-wider">
            Category
          </h3>

          {["all", "gold", "diamond", "gemstone"].map((item) => (
            <button
              key={item}
              onClick={() => updateFilter("category", item)}
              className={`block text-left text-sm mb-2 ${
                filters.category === item
                  ? "text-amber-400 font-medium"
                  : "text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* TYPE */}
        <div>
          <h3 className="text-sm uppercase mb-3 text-amber-500 font-semibold tracking-wider">
            Product Type
          </h3>

          {["all", "traditional", "modern", "casual"].map((item) => (
            <button
              key={item}
              onClick={() => updateFilter("type", item)}
              className={`block text-left text-sm mb-2 ${
                filters.type === item
                  ? "text-amber-400 font-medium"
                  : "text-gray-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* PRICE */}
        <div>
          <h3 className="text-sm uppercase mb-3 text-amber-500 font-semibold tracking-wider">
            Price
          </h3>

          {[
            { label: "All", value: "all" },
            { label: "Under ₹1500", value: "low" },
            { label: "₹1500 - ₹2000", value: "mid" },
            { label: "Above ₹2000", value: "high" },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => updateFilter("price", p.value)}
              className={`block text-left text-sm mb-2 ${
                filters.price === p.value
                  ? "text-amber-400 font-medium"
                  : "text-gray-400"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* CLEAR */}
        <button
        onClick={clearAllFilters}
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

      </div>
    </div>
  </div>
)}
    </section>
  );
}