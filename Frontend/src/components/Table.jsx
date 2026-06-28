import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;


export function Table({ data, type, refresh }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
 



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

const updateTracking = async (
  id,
  trackingId,
  courier
) => {
  const token = localStorage.getItem("token");

  await fetch(`${API}/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      trackingId,
      courier,
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

  const deleteOrder = async (id) => {
  if (!window.confirm("Delete this cancelled order?")) {
    return;
  }

  const token = localStorage.getItem("token");

  await fetch(`${API}/api/orders/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

 

  refresh();
};

const approveReturn = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API}/api/orders/${id}/approve-return`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  alert("Return approved");
  refresh();
};

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
  if (type === "rental") {
  return (
    <div
      key={item._id}
      className="rounded-xl border border-amber-500/20 bg-zinc-900 p-5"
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        
        {/* LEFT SIDE */}
        <div className="flex gap-4">
          <img
            src={item.productImage}
            alt={item.itemName}
            className="w-24 h-24 rounded-xl object-cover border border-amber-500/20"
          />

          <div>
            <h3 className="text-xl font-semibold text-amber-400">
              {item.itemName}
            </h3>

            <p className="text-gray-300 mt-2">
              Customer: {item.customerName}
            </p>

            <p className="text-gray-400">
              Rental ID: {item.rentalId}
            </p>

            <p className="text-gray-400">
              Booked On:{" "}
              {new Date(item.createdAt).toLocaleDateString()}
            </p>

            <p className="text-gray-400">
              Start Date:{" "}
              {new Date(item.rentalPeriod?.start).toLocaleDateString()}
            </p>

            <p className="text-gray-400">
              Return Date:{" "}
              {new Date(item.rentalPeriod?.end).toLocaleDateString()}
            </p>

            <p className="text-gray-400">
              Duration:{" "}
              {Math.ceil(
                (new Date(item.rentalPeriod?.end) -
                  new Date(item.rentalPeriod?.start)) /
                  (1000 * 60 * 60 * 24)
              )} Days
            </p>

            <p className="text-amber-400 font-semibold mt-2">
              ₹{item.total}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-3">
          <span className="text-white">
            Status: {item.status}
          </span>

          <select
            value={item.status}
            onChange={(e) =>
              updateStatus(item._id, e.target.value)
            }
            className="bg-black border border-zinc-700 p-3 rounded"
          >
            <option>Rental Order Accepted</option>
            <option>Booked</option>
            <option>Ongoing</option>
            <option>Returned</option>
            <option>Cancelled</option>
          </select>
        </div>

      </div>
    </div>
  );
}
    console.log("ORDER ITEMS:", item.items);
    console.log("ORDER ADDRESS:", item.shippingAddress);

    return (
      <div
        key={item._id}
    className="relative rounded-xl p-[1px] bg-gradient-to-r from-[#d4af37] via-[#f5e6b3] to-[#d4af37]"
      >
      <div className="bg-zinc-900 rounded-xl p-3 md:p-5">

  <div className="flex gap-4 mb-5">
   <img
  src={item.items?.[0]?.image}
  alt={item.items?.[0]?.name}
  className="w-24 h-24 rounded-xl object-cover border border-amber-500/20"
/>

    <div className="flex-1">
      <h3 className="text-xl font-semibold text-amber-400">
        {item.items?.[0]?.name || "Order"}
      </h3>

       <p className="text-gray-400 text-xs">
  Qty: {item.items?.[0]?.quantity || 1}
</p>

      <p className="text-gray-300 mt-2">
        Customer: {item.userId?.name || item.customerName}
      </p>

      <p className="text-gray-400">
        {item.customerEmail || item.userId?.email}
      </p>

      <p className="text-gray-400 text-sm">
        Order ID: {item._id}
      </p>

      <p className="text-gray-400 text-sm">
        {new Date(item.createdAt).toLocaleString()}
      </p>
    </div>
  </div>

  <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
         <div>
 {/* <h3 className="text-base md:text-lg font-semibold text-white break-words">
    {item.userId?.name || item.customerName || "Guest User"}
  </h3>

 <p className="text-sm text-gray-400">
  {item.customerEmail || item.userId?.email || "No email"}
</p> */}

{/* <p className="text-xs md:text-sm text-gray-400 break-all">
  Order ID: {item._id}
</p>

  <p className="text-sm text-gray-400">
    Date: {new Date(item.createdAt).toLocaleString()}
  </p> */}


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
  disabled={item.status === "Cancelled"}
  onChange={(e) =>
    updateStatus(item._id, e.target.value)
  }
  className={`w-full sm:w-auto p-3 border rounded ${
    item.status === "Cancelled"
      ? "bg-zinc-800 text-gray-500 cursor-not-allowed"
      : "bg-black border-zinc-700"
  }`}
>
    <option>Order Confirmed</option>
    <option>Processing</option>
    <option>Ready to be Shipped</option>
    <option>Shipped</option>
    <option>Out For Delivery</option>
    <option>Delivered</option>
    <option>Returned</option>
    <option>Cancelled</option>
  </select>
  {item.status === "Cancelled" && (
  <button
    onClick={() => deleteOrder(item._id)}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
  >
    Delete Order
  </button>
)}

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
<div className="flex flex-col">
  <label className="text-xs text-gray-400 mb-1">
    Courier
  </label>

  <input
    type="text"
    defaultValue={item.courier || ""}
    placeholder="DTDC"
    onBlur={(e) =>
      updateTracking(
        item._id,
        item.trackingId || "",
        e.target.value
      )
    }
    className="w-full sm:w-auto bg-black border border-zinc-700 p-3 rounded"
  />
</div>
<div className="flex flex-col">
  <label className="text-xs text-gray-400 mb-1">
    Tracking ID
  </label>

  <input
    type="text"
    defaultValue={item.trackingId || ""}
    placeholder="AWB Number"
    onBlur={(e) =>
      updateTracking(
        item._id,
        e.target.value,
        item.courier || ""
      )
    }
    className="w-full sm:w-auto bg-black border border-zinc-700 p-3 rounded"
  />

  {item.returnRequested && item.status !== "Returned" && (
  <div className="mt-4 p-3 rounded bg-red-900/20 border border-red-500">
    <p className="text-red-400 font-semibold">
      Return Requested
    </p>

    <p className="text-gray-300 mb-3">
      Reason: {item.returnReason}
    </p>

    <button
      onClick={() => approveReturn(item._id)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      Accept Return
    </button>
  </div>
)}

</div>
</div>
        </div>
      </div>
      </div>
    );
  })}
</div>

    </div>
  );
}