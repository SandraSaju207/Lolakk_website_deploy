import { useState, useEffect, useRef } from "react";
import axios from "axios"; // Added for Backend Connection
import AdminLayout from "../components/AdminLayout";
import useNotifications from "../hooks/useNotifications";
import { Notifications } from "../components/Notifications";
import { Table } from "../components/Table";
import AdminReviews from "./AdminReviews";

const API = import.meta.env.VITE_API_URL;
console.log("API URL:", API);

const getImage = (img) =>
  img?.startsWith("http") ? img : `${API}${img}`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [orders, setOrders] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [products, setProducts] = useState([]);
  const [productStyle, setProductStyle] = useState("traditional");
  const [materialType, setMaterialType] = useState("gold");
  const [ItemType,setItemType] = useState("bangle");
  const [kidsItemType, setKidsItemType] = useState("hair_bun");
  const [savingProduct, setSavingProduct] = useState(false);
  const [stockFilter, setStockFilter] = useState("all");
  const [comboType, setComboType] = useState("bridal");

  const notifications = useNotifications();

  // ✨ NEW STATES (UPDATED)
  const [showModal, setShowModal] = useState(false);
  const [productType, setProductType] = useState("");
  const [isTrending, setIsTrending] = useState(false); // For Trending Items
  const [editingProduct, setEditingProduct] = useState(null); // Added for Edit Logic

  // BASE URL
  axios.defaults.baseURL = API;
  axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

  // Form States for Modal
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: 0,
    price: 0,
    audience: "Women",
    extra: "",
     sizes: [],
  });

  // State to hold the physical file
  const [selectedFile, setSelectedFile] = useState(null);

  // ===================== ORDERS STATUS CONTROL =====================
  const [pendingOrderStatus, setPendingOrderStatus] = useState({});
  const [lockedOrders, setLockedOrders] = useState({});
  const orderTimeouts = useRef({});

  // ===================== RENTAL STATUS CONTROL =====================
  const [pendingRentalStatus, setPendingRentalStatus] = useState({});
  const [lockedRentals, setLockedRentals] = useState({});

  const [accessoryType, setAccessoryType] =
  useState("bow");

const [occasion, setOccasion] =
  useState("daily");

  const rentalTimeouts = useRef({});

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAll();
      } catch (err) {
        console.error("Error in useEffect:", err);
      }
    };
    loadData();
  }, []);

  // ===================== BACKEND SYNC =====================
  const fetchAll = async () => {
    try {
    const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const [orderRes, rentalRes, productRes] = await Promise.all([
  axios.get("/api/orders", config),
  axios.get("/api/rentals", config),
  axios.get("/api/products", config),
]);

console.log("Orders Response:", orderRes.data);
console.log("Rentals Response:", rentalRes.data);
console.log("Products Response:", productRes.data);
      
      setOrders(orderRes.data);
      console.log("Orders:", orderRes.data);
      setRentals(rentalRes.data);
      setProducts(productRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setOrders([]);
      setRentals([]);
      setProducts([]);
    }
  };

  
  // ===================== EDIT LOGIC =====================
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
       description: product.description || "",
      stock: product.stock,
      price: product.price,
      audience: product.audience,
      extra: product.extra || "",
    sizes:
  typeof product.sizes === "string"
    ? JSON.parse(product.sizes)
    : product.sizes || [],
    });
    setProductType(product.type);
    setProductStyle(product.style || "traditional");
    setIsTrending(product.trending || false);
    setMaterialType(product.materialType || "gold");
    setItemType(product.itemType || "bangle");
    setAccessoryType(product.accessoryType || "bow");
    setOccasion(product.occasion || "daily");
    setComboType(product.comboType || "bridal");
    setShowModal(true);
  };

  // ===================== DELETE LOGIC =====================
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to remove this product from the inventory?")) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchAll(); 
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete the product.");
      }
    }
  };

  const token = localStorage.getItem("token");

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
};

  // ===================== SAVE/UPDATE LOGIC =====================
  const handleSaveProduct = async () => {
  try {
    setSavingProduct(true);

    if (!formData.name || !productType) {
      setSavingProduct(false);
      return alert("Product name and category are required.");
    }

    const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("type", productType);
      formDataToSend.append("style", productStyle);
      formDataToSend.append("audience", formData.audience);
      formDataToSend.append("extra", formData.extra);
      formDataToSend.append("trending", isTrending);
      formDataToSend.append("materialType", materialType);
      formDataToSend.append(
  "sizes",
  JSON.stringify(formData.sizes)
);
      
      // ✅ Only send itemType when needed
if (productType === "kids") {
  formDataToSend.append("itemType", kidsItemType);
}

if (productType === "bracelets") {
  formDataToSend.append("itemType", ItemType);
}

if (productType === "hair-accessories") {
  formDataToSend.append(
    "accessoryType",
    accessoryType
  );

  formDataToSend.append(
    "occasion",
    occasion
  );
}

if (productType === "combo") {
  formDataToSend.append("comboType", comboType);
}
      
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      if (editingProduct && editingProduct._id) {
       await axios.patch(
  `/api/products/${editingProduct._id}`,
  formDataToSend,
  authConfig
);
      } else {
       await axios.post(
  "/api/products",
  formDataToSend,
  authConfig
);
      }

      setShowModal(false);
      setEditingProduct(null);
      setSelectedFile(null);
      setComboType("bridal");
      setFormData({ name: "", stock: 0, price: 0, audience: "Women", extra: "" , sizes: []});
      fetchAll(); 
      
     } catch (err) {
    console.error("Save Error:", err);
    alert(err.response?.data?.message || "Failed to save product.");
  } finally {
    setSavingProduct(false);
  }
};

  // ===================== STATUS HANDLERS =====================
  const handleOrderStatusChange = (id, status) => {
    if (lockedOrders[id]) return;
    if (orderTimeouts.current[id]) clearTimeout(orderTimeouts.current[id]);

    setPendingOrderStatus((prev) => ({ ...prev, [id]: status }));

    orderTimeouts.current[id] = setTimeout(async () => {
      try {
        await axios.patch(`/api/orders/${id}`, { status });
        setLockedOrders((prev) => ({ ...prev, [id]: true }));
        setPendingOrderStatus((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } catch (err) {
        console.error("Status Update Failed", err);
        undoOrderChange(id);
      }
    }, 5000);
  };

  const undoOrderChange = (id) => {
    if (orderTimeouts.current[id]) clearTimeout(orderTimeouts.current[id]);
    setPendingOrderStatus((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleRentalStatusChange = (id, status) => {
    if (lockedRentals[id]) return;
    if (rentalTimeouts.current[id]) clearTimeout(rentalTimeouts.current[id]);

    setPendingRentalStatus((prev) => ({ ...prev, [id]: status }));

    rentalTimeouts.current[id] = setTimeout(async () => {
      try {
        await axios.patch(`/api/rentals/${id}`, { status });
        setLockedRentals((prev) => ({ ...prev, [id]: true }));
        setPendingRentalStatus((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } catch (err) {
        console.error("Rental update failed", err);
        undoRentalChange(id);
      }
    }, 5000);
  };

  const undoRentalChange = (id) => {
    if (rentalTimeouts.current[id]) clearTimeout(rentalTimeouts.current[id]);
    setPendingRentalStatus((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // Safe calculations
const revenue = Array.isArray(orders)
  ? orders.reduce((sum, o) => sum + (o.total || 0), 0)
  : 0;

const activeRentals = Array.isArray(rentals)
  ? rentals.filter(r => r.status !== "Returned").length
  : 0;

const lowStock = Array.isArray(products)
  ? products.filter(p => p.stock < 5).length
  : 0;

const trendingProducts = Array.isArray(products)
  ? products.filter(p => p.trending === true)
  : [];

  const filteredProducts =
  stockFilter === "all"
    ? products
    : products.filter((p) => p.type === stockFilter);

    

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      
      <Notifications notifications={notifications} />

      {/* ================= DASHBOARD ================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f5e6b3]">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-1 text-sm md:text-base">Monitor your business performance in real time</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:scale-[1.02] transition">
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <h2 className="text-2xl mt-2 text-[#d4af37] font-semibold">₹{revenue}</h2>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:scale-[1.02] transition">
              <p className="text-gray-400 text-sm">Active Rentals</p>
              <h2 className="text-2xl mt-2 font-semibold">{activeRentals}</h2>
            </div>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:scale-[1.02] transition">
              <p className="text-gray-400 text-sm">Low Stock Alerts</p>
              <h2 className="text-2xl mt-2 text-red-400 font-semibold">{lowStock}</h2>
            </div>
          </div>
        </div>
      )}

      {/* ================= ORDERS ================= */}
      {activeTab === "orders" && (
        <div className="relative space-y-8">
          <div className="absolute -top-10 right-10 w-72 h-72 bg-[#d4af37]/10 blur-[120px] rounded-full"></div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f5e6b3] to-[#d4af37]">
                Orders
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage and track all customer purchases</p>
            </div>
          </div>
          <div className="relative p-3 md:p-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 overflow-x-auto">
            <Table
              data={orders}
              type="order"
              refresh={fetchAll}
              pendingStatus={pendingOrderStatus}
              lockedStatus={lockedOrders}
              onStatusChange={handleOrderStatusChange}
              onUndo={undoOrderChange}
            />
          </div>
        </div>
      )}

      {/* ================= RENTALS ================= */}
      {activeTab === "rentals" && (
        <div className="relative space-y-8">
          <div className="absolute -top-10 left-10 w-72 h-72 bg-[#d4af37]/10 blur-[120px] rounded-full"></div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f5e6b3] to-[#d4af37]">
                Rental Orders
              </h1>
              <p className="text-gray-400 text-sm mt-1">Track ongoing and returned rentals</p>
            </div>
          </div>
         <div className="relative p-3 md:p-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 overflow-x-auto">
            <Table
              data={rentals}
              type="rental"
              refresh={fetchAll}
              pendingStatus={pendingRentalStatus}
              lockedStatus={lockedRentals}
              onStatusChange={handleRentalStatusChange}
              onUndo={undoRentalChange}
            />
          </div>
        </div>
      )}

      {/* ================= STOCK ================= */}
      {activeTab === "stock" && (
        <div className="relative space-y-10">
          <div className="absolute top-0 right-1/3 w-72 h-72 bg-[#d4af37]/10 blur-[120px] rounded-full"></div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f5e6b3] to-[#d4af37]">
                Stock Management
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage inventory & add new products</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({ name: "", stock: 0, price: 0, audience: "Women", extra: "", sizes: [] });
                setProductType("");
                setProductStyle("traditional");
                setShowModal(true);
              }}
              className="w-full md:w-auto px-6 py-3 md:py-2 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-black font-semibold hover:scale-105 transition"
            >
              + Add Product
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 relative z-10">

           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
  
  <h2 className="text-lg text-[#d4af37] font-semibold">
    Current Inventory
  </h2>

 <div className="relative w-full md:w-auto">
    <select
      value={stockFilter}
      onChange={(e) => setStockFilter(e.target.value)}
      className="
      w-full md:w-auto
        appearance-none
        bg-black/40
        backdrop-blur-xl
        border border-[#d4af37]/20
        text-[#d4af37]
        rounded-xl
        px-4 py-2.5
        pr-10
        text-sm
        font-medium
        outline-none
        transition-all
        duration-300
        hover:border-[#d4af37]/50
        focus:border-[#d4af37]
        focus:shadow-[0_0_15px_rgba(212,175,55,0.2)]
      "
    >
      <option value="all">All Products</option>
      <option value="rentals">Rentals</option>
      <option value="rings">Rings</option>
      <option value="bracelets">Bracelets</option>
      <option value="necklaces">Necklaces</option>
      <option value="kids">Kids</option>
      <option value="earrings">Earrings</option>
      <option value="hair-accessories">Hair Accessories</option>
      <option value="combo">combo</option>
    </select>

    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#d4af37]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>

</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {filteredProducts.map((p) => (
                <div key={p._id} className="p-3 md:p-4 rounded-xl bg-black/40 border border-white/10 group relative overflow-hidden transition-all duration-300 hover:border-[#d4af37]/30">
                  
                  {/* TRENDING BADGE */}
                  {p.trending && (
                    <div className="absolute top-0 right-0 z-40">
                      <div className="bg-gradient-to-l from-[#d4af37] to-[#b8962e] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-1 uppercase tracking-tighter">
                        <span className="animate-pulse">★</span> Trending
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 z-30 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                    <button onClick={() => handleEditClick(p)} className="p-2 rounded-full bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37] hover:text-black backdrop-blur-md transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteProduct(p._id)} className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white backdrop-blur-md transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="h-28 sm:h-32 md:h-40 w-full mb-3 rounded-lg overflow-hidden bg-black/60 border border-white/5 relative">
                    {p.image ? (
                      <img
  src={getImage(p.image)}
  alt={p.name}
  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
/>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-600 text-xs italic">No Image</div>
                    )}
                  </div>

                 <div className="space-y-1">
  <h3 className="text-sm md:text-base text-white font-medium truncate">
    {p.name}
  </h3>

  <p className="text-[11px] text-amber-400 font-mono">
    ID: {p.productId}
  </p>

  <p className="text-xs text-gray-400 line-clamp-2 min-h-[32px]">
    {p.description || "No description"}
  </p>

  <div className="flex justify-between items-end">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">{p.type}</p>
                        <p className={`font-semibold ${p.stock < 5 ? 'text-red-400' : 'text-[#d4af37]'}`}>Stock: {p.stock}</p>
                      </div>
                      <p className="text-white/80 text-sm">₹{p.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TRENDING ITEMS ================= */}
      {activeTab === "trending" && (
        <div className="relative space-y-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/5 blur-[150px] rounded-full"></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f5e6b3]">
              Trending Collection
            </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Products currently featured on the trending storefront</p>
          </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {trendingProducts.map((p) => (
              <div key={p._id} className="p-5 rounded-2xl bg-white/5 border border-[#d4af37]/30 backdrop-blur-md">
                 <div className="w-full h-32 bg-white/10 rounded-lg mb-4 overflow-hidden">
                  <img src={getImage(p.image)} alt={p.name} className="w-full h-full object-cover" />
                 </div>
                 <h3 className="text-white font-semibold">{p.name}</h3>
                 <p className="text-[#d4af37] text-sm uppercase tracking-widest mt-1">{p.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

   {activeTab === "reviews" && (
  <div className="relative space-y-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f5e6b3] to-[#d4af37]">
        Customer Reviews
      </h1>

      <p className="text-gray-400 text-sm mt-1">
        Manage customer feedback
      </p>
    </div>

    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10">
      <AdminReviews />
    </div>
  </div>
)}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl p-4 md:p-8 rounded-3xl bg-[#111] border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-serif text-[#d4af37] mb-6">
               {editingProduct ? "Edit Luxury Item" : "Add New Luxury Item"}
            </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Product Name</label>
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ex: Regal Gold Bangle" className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition" />
              </div>
              <div className="space-y-1 md:col-span-2">
  <label className="text-xs text-gray-500 ml-1">
    Description
  </label>

  <textarea
    value={formData.description}
    onChange={(e) =>
      setFormData({
        ...formData,
        description: e.target.value,
      })
    }
    rows={4}
    placeholder="Enter product description..."
    className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition resize-none"
  />
</div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Price (₹)</label>
                <input value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} type="number" className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Initial Stock</label>
                <input value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} type="number" className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Product Image</label>
                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-full p-2 text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#d4af37]/10 file:text-[#d4af37] transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Category Type</label>
                <select value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition">
                  <option value="">Select Category</option>
                  <option value="rentals">Rentals</option>
                  <option value="rings">Rings</option>
                  <option value="earrings">Earrings</option>
                  <option value="bracelets">Bracelets & Bangles</option>
                  <option value="necklaces">Necklaces & Pendants</option>
                   <option value="hair-accessories">Hair Accessories</option>
                  <option value="kids">Kids</option>
                  <option value="combo">combo</option>
                </select>
              </div>

  {productType === "kids" && (
  <>
    <div className="space-y-1">
      <label className="text-xs text-gray-500 ml-1">
        Kids Product Type
      </label>

      <select
        value={kidsItemType}
        onChange={(e) => setKidsItemType(e.target.value)}
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition"
      >
        <option value="hair_bun">Hair Bun</option>
        <option value="hair_clip">Hair Clip</option>
        <option value="hair_bow">Hair Bow</option>
        <option value="kids_bangles">Kids Bangles</option>
        <option value="kids_necklace">Kids Necklace</option>
      </select>
    </div>

    <div className="space-y-1">
      <label className="text-xs text-gray-500 ml-1">
        Age Group
      </label>

      <select
        value={formData.extra}
        onChange={(e) =>
          setFormData({
            ...formData,
            extra: e.target.value,
          })
        }
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition"
      >
        <option value="">Select Age Group</option>
        <option value="0-1 Years">0-1 Years</option>
        <option value="1-3 Years">1-3 Years</option>
        <option value="3-5 Years">3-5 Years</option>
        <option value="5-8 Years">5-8 Years</option>
        <option value="8-12 Years">8-12 Years</option>
      </select>
    </div>
  </>
)}
              {productType === "bracelets" && (
  <div className="space-y-1 ">
    <label className="text-xs text-gray-500 ml-1">
      Item Type
    </label>

    <select
      value={ItemType}
      onChange={(e) => setItemType(e.target.value)}
      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition"
    >
      <option value="bracelet">Bracelet</option>
      <option value="bangle">Bangle</option>
    </select>
  </div>
)}

{productType === "hair-accessories" && (
  <>
    <div>
      <label className="text-xs text-gray-500">
        Accessory Type
      </label>

      <select
        value={accessoryType}
        onChange={(e) =>
          setAccessoryType(e.target.value)
        }
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white"
      >
        <option value="bow">Bow</option>
        <option value="clip">Clip</option>
        <option value="scrunchie">Scrunchie</option>
        <option value="bun">Bun</option>
        <option value="headband">Headband</option>
        <option value="hairpin">Hair Pin</option>
      </select>
    </div>

    <div>
      <label className="text-xs text-gray-500">
        Occasion
      </label>

      <select
        value={occasion}
        onChange={(e) =>
          setOccasion(e.target.value)
        }
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white"
      >
        <option value="daily">Daily Wear</option>
        <option value="party">Party</option>
        <option value="wedding">Wedding</option>
        <option value="festival">Festival</option>
        <option value="school">School</option>
      </select>
    </div>
  </>
)}


             {productType !== "kids" && (
  <>
    <div className="space-y-1">
      <label className="text-xs text-gray-500 ml-1">
        Material Type
      </label>

      <select
        value={materialType}
        onChange={(e) => setMaterialType(e.target.value)}
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition"
      >
        <option value="gold">Gold</option>
        <option value="diamond">Diamond</option>
        <option value="gemstone">Gemstone</option>
          <option value="silver">Silver</option>
      </select>
    </div>

    <div className="space-y-1">
      <label className="text-xs text-gray-500 ml-1">
        Jewellery Style
      </label>

      <select
        value={productStyle}
        onChange={(e) => setProductStyle(e.target.value)}
        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition"
      >
        <option value="traditional">Traditional</option>
        <option value="modern">Modern</option>
        <option value="casual">Casual</option>
      </select>
    </div>
  </>
)}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Target Audience</label>
                <select value={formData.audience} onChange={(e) => setFormData({...formData, audience: e.target.value})} className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#d4af37] outline-none transition">
                  <option>Women</option>
                  <option>Kids</option>
                  <option>Unisex</option>
                </select>
              </div>
              {/* ================= DYNAMIC EXTRA DETAILS FIELD ================= */}
           {/* ================= DYNAMIC EXTRA DETAILS FIELD ================= */}
{/* Extra field for all except bracelets */}
{["rentals", "rings", "necklaces", "kids", "combo"].includes(productType) && (
  <div className="space-y-1 md:col-span-2">
    <label className="text-xs text-gray-500 ml-1">
      {{
        rentals: "Rental Period & Rules",
        rings: "Ring Size (Standard)",
        necklaces: "Necklace Chain Length",
        kids: "Age Group",
        combo: "Combo Includes",
      }[productType]}
    </label>

    <input
      value={formData.extra}
      onChange={(e) =>
        setFormData({ ...formData, extra: e.target.value })
      }
      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white"
    />
  </div>
)}

{/* Available Sizes for Bangles & Bracelets */}
{productType === "bracelets" && (
  <div className="space-y-2 md:col-span-2">
    <label className="text-xs text-gray-500 ml-1">
      Available Sizes
    </label>

    <input
      type="text"
     value={
  Array.isArray(formData.sizes)
    ? formData.sizes.join(", ")
    : ""
}
      onChange={(e) =>
        setFormData({
          ...formData,
          sizes: e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        })
      }
      placeholder={
        ItemType === "bangle"
          ? "Example: 2.2, 2.4, 2.6"
          : "Example: Small, Medium, Large"
      }
      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white"
    />

    <p className="text-xs text-gray-500">
      Enter sizes separated by commas.
    </p>
  </div>
)}
             
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <input type="checkbox" id="trending" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="w-5 h-5 accent-[#d4af37]" />
              <label htmlFor="trending" className="text-gray-300 cursor-pointer select-none">Mark as Customer Favorite</label>
            </div>

           <div className="mt-8 flex flex-col md:flex-row gap-3 md:space-x-4">
              <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition">Cancel</button>
              <button
  onClick={handleSaveProduct}
  disabled={savingProduct}
  className={`flex-1 px-6 py-3 rounded-xl font-bold transition ${
    savingProduct
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-black"
  }`}
>
  {savingProduct
    ? "Saving Product..."
    : editingProduct
      ? "Update Product"
      : "Save Product"}
</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}