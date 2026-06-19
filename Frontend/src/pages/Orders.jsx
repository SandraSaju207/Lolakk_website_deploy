import { useState, useEffect } from "react";
import { 
  Package, Clock, CheckCircle, ChevronDown, ChevronUp, 
  Truck, ShieldCheck, Home, RefreshCcw, XCircle, Undo2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. Define your Backend URL
const BASE_URL = import.meta.env.VITE_API_URL;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token); // 🔥 DEBUG 1

      const response = await fetch(`${BASE_URL}/api/orders`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {}
      });

      console.log("STATUS:", response.status); // 🔥 DEBUG 2

      const data = await response.json();
      console.log("ORDERS FROM BACKEND:", data); // 🔥 DEBUG 3

      setOrders(data);

    } catch (err) {
      console.error("FETCH FAILED:", err); // 🔥 IMPORTANT
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);

  // 2. IMPROVED Helper function to fix image paths
  const getImageUrl = (path) => {
   if (!path)
  return "https://placehold.co/150x150/111111/FFFFFF?text=LOLAKK";
    
    // If it's already a full URL (cloudinary, etc.), return as is
    if (path.startsWith("http")) return path; 

    // Remove any leading slash to avoid double slashes
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    /** * IMPORTANT FIX: 
     * If your images are in an 'uploads' folder but the DB doesn't say 'uploads/', 
     * change the return below to: return `${BASE_URL}/uploads/${cleanPath}`;
     */
    return `${BASE_URL}/${cleanPath}`;
  };

  const toggleTrack = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      alert(`Order cancellation request sent for ${id}`);
    }
  };

  const handleReturnOrder = async (id) => {
    if (window.confirm("Do you wish to initiate a return?")) {
      alert(`Return process started for ${id}`);
    }
  };

  return (
   <section className="pt-24 md:pt-32 pb-20 md:pb-24 px-4 md:px-6 max-w-5xl mx-auto text-white bg-black min-h-screen">
      <style>{`
        .serif { font-family: 'Playfair Display', serif; }
        .gold-gradient { background: linear-gradient(to right, #fbbf24, #fef3c7, #b45309); -webkit-background-clip: text; color: transparent; }
        .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); }
        @keyframes pulse-gold {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        .pulse-gold { animation: pulse-gold 2s infinite; }
      `}</style>

      <div className="text-center mb-8 md:mb-16">
       <h1 className="text-3xl md:text-4xl serif gold-gradient mb-2">Order History</h1>
        <p className="text-gray-400 italic">Tracking your curated selections</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-white/10">
          <Package className="mx-auto mb-4 text-gray-600" size={48} />
          <p className="text-xl text-gray-500">No orders found yet</p>
          <button onClick={() => navigate("/")} className="mt-4 text-amber-500 underline">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderId = order._id || order.id;
            const isExpanded = expandedOrderId === orderId;
            const status = order.status || "Order Confirmed";
            const isDelivered = status === "Delivered";
            
            return (
              <div key={orderId} className="glass border border-white/10 rounded-2xl overflow-hidden transition-all duration-500">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-3 bg-white/5">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Order ID</p>
                    <p className="font-mono text-sm text-amber-200">#LOK-{String(orderId).slice(-8)}</p>
                  </div>
                  {order.expectedDeliveryDate && (
  <p className="text-xs text-amber-400 mt-1">
    Expected Delivery:
    {" "}
    {new Date(
      order.expectedDeliveryDate
    ).toLocaleDateString("en-IN")}
  </p>
)}
               <div className="flex flex-row items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Status</p>
                      <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                        <CheckCircle size={14} /> {order.status || "Confirmed"}
                      </div>
                    </div>
                    {!isDelivered && (
                      <button onClick={() => handleCancelOrder(orderId)} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold uppercase transition border border-red-500/20">
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                    <button onClick={() => toggleTrack(orderId)} className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-4 py-2 rounded-xl text-xs font-bold uppercase transition border border-amber-500/20">
                      {isExpanded ? <><ChevronUp size={14} /> Close</> : <><ChevronDown size={14} /> Track</>}
                    </button>
                  </div>
                </div>

                {/* Track Section */}
{isExpanded && (
 <div className="p-4 md:p-8 bg-black/40 border-b border-white/5">
    <div className="max-w-2xl mx-auto">
     <div className="relative space-y-6 md:space-y-8 ml-2 md:ml-4">

        <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-amber-500/20" />

        <TrackStep
          icon={<ShieldCheck size={16} />}
          label="Order Confirmed"
          active={true}
          done={true}
        />

        <TrackStep
          icon={<RefreshCcw size={16} />}
          label="Processing"
          active={[
            "Processing",
            "Ready to be Shipped",
            "Shipped",
            "Out For Delivery",
            "Delivered",
          ].includes(status)}
          done={[
            "Ready to be Shipped",
            "Shipped",
            "Out For Delivery",
            "Delivered",
          ].includes(status)}
        />

        <TrackStep
          icon={<Package size={16} />}
          label="Ready to be Shipped"
          active={[
            "Ready to be Shipped",
            "Shipped",
            "Out For Delivery",
            "Delivered",
          ].includes(status)}
          done={[
            "Shipped",
            "Out For Delivery",
            "Delivered",
          ].includes(status)}
        />

        <TrackStep
          icon={<Truck size={16} />}
          label="Shipped"
          active={[
            "Shipped",
            "Out For Delivery",
            "Delivered",
          ].includes(status)}
          done={[
            "Out For Delivery",
            "Delivered",
          ].includes(status)}
        />

        <TrackStep
          icon={<Home size={16} />}
          label="Out For Delivery"
          active={[
            "Out For Delivery",
            "Delivered",
          ].includes(status)}
          done={status === "Delivered"}
        />

        <TrackStep
          icon={<CheckCircle size={16} />}
          label="Delivered"
          active={status === "Delivered"}
          done={status === "Delivered"}
        />

      </div>
    </div>
  </div>
)}
                {/* ITEMS LIST */}
                <div className="p-6 space-y-4">
                 {order.items?.map((item, idx) => {
  console.log("FULL ITEM:", item);

  return (
    <div key={idx} className="flex items-center gap-4">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg border border-white/10 overflow-hidden bg-zinc-900 shadow-xl">
        <img
          src={getImageUrl(
            item.image || item.img || item.productImage
          )}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/150x150/111111/FFFFFF?text=LOLAKK";
          }}
        />
      </div>

      <div className="flex-1">
       <h3 className="text-xs md:text-sm font-medium">
          {item.name}
        </h3>

        <p className="text-xs text-gray-400">
          Qty: {item.quantity || item.qty || 1}
        </p>
      </div>
    </div>
  );
})}
                </div>

                {/* Footer */}
               <div className="p-4 bg-white/5 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-start md:items-center px-4 md:px-6 border-t border-white/5">
                   <span className="text-gray-400 text-xs flex items-center gap-2">
                     <Clock size={14}/> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                   </span>
                 <div className="text-base md:text-lg font-bold serif">
                     Total Paid: <span className="text-amber-500">₹{order.total}</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TrackStep({ icon, label, date, active, done, pulse }) {
  return (
    <div className="relative pl-10 flex items-start gap-4">
      <div className={`absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center z-10 transition-colors ${done ? 'bg-amber-500 text-black' : active ? 'bg-zinc-800 border border-amber-500 text-amber-500' : 'bg-zinc-900 border border-zinc-700 text-zinc-600'} ${pulse ? 'pulse-gold shadow-[0_0_10px_rgba(251,191,36,0.3)]' : ''}`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-bold ${active ? 'text-white' : 'text-zinc-500'}`}>{label}</p>
        <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">{date}</p>
      </div>
    </div>
  );
}   