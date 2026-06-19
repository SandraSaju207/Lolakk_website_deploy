import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;


export function Table({ data, type, refresh }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
  if (previewImage) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}, [previewImage]);

  const updateStatus = async (id, status) => {
   const token = localStorage.getItem("token");

await fetch(
  `${API}/api/${type === "order" ? "orders" : "rentals"}/${id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  }
);
    refresh();
  };

  const updateDeliveryDate = async (
  id,
  expectedDeliveryDate
) => {
  const token = localStorage.getItem("token");

await fetch(`${API}/api/orders/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    expectedDeliveryDate,
  }),
});

  refresh();
};

  const filtered = data.filter((item) => {
    const matchSearch =
  item.customerName?.toLowerCase().includes(search.toLowerCase()) ||
  item.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
  item.userId?.email?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div>
     <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-auto p-3 bg-black border border-zinc-700 rounded-lg"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
         className="w-full sm:w-auto p-3 bg-black border border-zinc-700 rounded-lg"
        >
          <option value="all">All</option>

          {type === "order" ? (
            <>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </>
          ) : (
            <>
              <option value="Booked">Booked</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Returned">Returned</option>
            </>
          )}
        </select>
      </div>
<div className="space-y-4">
  {filtered.map((item) => {
    console.log("ORDER ITEMS:", item.items);
    console.log("ORDER ADDRESS:", item.shippingAddress);

    return (
      <div
        key={item._id}
    className="relative rounded-xl p-[1px] bg-gradient-to-r from-[#d4af37] via-[#f5e6b3] to-[#d4af37] animate-pulse"
      >
        <div className="bg-zinc-900 rounded-xl p-3 md:p-5">
       <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
         <div>
 <h3 className="text-base md:text-lg font-semibold text-white break-words">
    {item.userId?.name || item.customerName || "Guest User"}
  </h3>

 <p className="text-sm text-gray-400">
  {item.customerEmail || item.userId?.email || "No email"}
</p>

<p className="text-xs md:text-sm text-gray-400 break-all">
  Order ID: {item._id}
</p>

  <p className="text-sm text-gray-400">
    Date: {new Date(item.createdAt).toLocaleString()}
  </p>


  {/* ADDRESS */}
  {item.shippingAddress?.fullAddress ? (
  <div className="mt-3 bg-zinc-800 p-3 rounded-lg text-sm md:text-base">
      <p className="text-amber-400 font-medium">
        Delivery Address
      </p>
<p className="text-amber-300 font-semibold">
  {item.shippingAddress.name}
</p>
      <p className="text-gray-300">
        {item.shippingAddress.label}
      </p>

      <p className="text-gray-400">
        {item.shippingAddress.fullAddress}
      </p>

      <p className="text-gray-400">
        {item.shippingAddress.district}, {item.shippingAddress.state}
      </p>

      <p className="text-gray-400">
        PIN: {item.shippingAddress.pincode}
      </p>

      <p className="text-gray-400">
        Phone: {item.shippingAddress.phone}
      </p>
    </div>
  ) : (
    <p className="text-red-400 mt-2 text-sm">
      No delivery address found
    </p>
  )}
</div>

          <div className="text-right">
            {item.paymentStatus && item.paymentStatus !== "Unpaid" && (
              <p className="text-sm text-gray-400">
                {item.paymentStatus}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">
            Ordered Items
          </h4>

          {item.items?.map((product, index) => (
            <div
              key={index}
             className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 py-3 gap-2"
            >
             <div className="flex items-center gap-3 w-full">
                <img
  src={product.image}
  alt={product.name}
  onClick={() => {
  console.log("CLICKED IMAGE VALUE:", product.image);
  setPreviewImage(product.image);
}}
  className="w-14 h-14 md:w-12 md:h-12 rounded-md object-cover border border-zinc-700 cursor-pointer hover:scale-110 hover:shadow-lg transition duration-200"
/>

                <span className="text-gray-300 text-sm md:text-base break-words">
                  {product.name}
                </span>
              </div>

              <span className="text-gray-400">
                Qty: {product.quantity}
              </span>

              <span className="text-amber-400">
                ₹{product.price}
              </span>
            </div>
          ))}
        </div>

       <div className="mt-4 border-t border-zinc-700 pt-3 text-sm md:text-base">
  <div className="flex justify-between text-gray-400">
    <span>Product Total</span>
    <span>₹{item.total - 100}</span>
  </div>

  <div className="flex justify-between text-gray-400">
    <span>Delivery Charge</span>
    <span>₹100</span>
  </div>

  <div className="flex justify-between text-amber-400 font-bold text-lg mt-2">
    <span>Grand Total</span>
    <span>₹{item.total}</span>
  </div>
</div>
<div className="flex flex-col md:flex-row gap-4 md:gap-0 md:items-center md:justify-between">
          <span className="text-white">
            Status: {item.status}
          </span>

       <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
  <select
    value={item.status}
    onChange={(e) =>
      updateStatus(item._id, e.target.value)
    }
    className="w-full sm:w-auto p-3 bg-black border border-zinc-700 rounded"
  >
    <option>Order Confirmed</option>
    <option>Processing</option>
    <option>Ready to be Shipped</option>
    <option>Shipped</option>
    <option>Out For Delivery</option>
    <option>Delivered</option>
    <option>Cancelled</option>
  </select>

  <div className="flex flex-col">
  <label className="text-xs text-gray-400 mb-1">
    Expected Delivery Date
  </label>

  <input
    type="date"
    value={
      item.expectedDeliveryDate
        ? item.expectedDeliveryDate.slice(0, 10)
        : ""
    }
    onChange={(e) =>
      updateDeliveryDate(
        item._id,
        e.target.value
      )
    }
    className="w-full sm:w-auto bg-black border border-zinc-700 p-3 rounded"
  />
</div>
</div>
        </div>
      </div>
      </div>
    );
  })}
</div>
{previewImage && (
  <div
    onClick={() => setPreviewImage(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999999,
      backdropFilter: "blur(4px)",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "relative",
        background: "#111",
        padding: "12px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        maxWidth: "600px",
        width: "90%",
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setPreviewImage(null)}
        style={{
          position: "absolute",
          top: "6px",
          right: "8px",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <img
        src={previewImage}
        style={{
          width: "100%",
          maxHeight: "80px",
          objectFit: "contain",
          borderRadius: "8px",
        }}
      />
    </div>
  </div>
)}
    </div>
  );
}