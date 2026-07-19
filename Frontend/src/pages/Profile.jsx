import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const API_URL = API;

export default function Profile() {
  const [user, setUser] = useState({
  email: localStorage.getItem("userEmail"),
  role: localStorage.getItem("userRole") || "user",
});

const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");
  const [cart, setCart] = useState([]);

const userId = localStorage.getItem("userId");
const cartKey = `lolakk_cart_${userId}`;
const [addresses, setAddresses] = useState([]);
const [showModal, setShowModal] = useState(false);
const [editing, setEditing] = useState(null);
const [form, setForm] = useState({
  name: "",
  label: "Home",
  country: "India",
  state: "",
  phone: "",
  pincode: "",
  district: "",
  fullAddress: "",
});


const navigate = useNavigate();


  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
  try {
    const rawData = localStorage.getItem(cartKey);

    if (rawData) {
      const parsed = JSON.parse(rawData);

      const normalizedCart = parsed.map((item) => ({
        ...item,
        id: item.id || item._id,
        qty: Number(item.qty) > 0 ? Number(item.qty) : 1,
        price: Number(item.price) || 0,
      }));

      setCart(normalizedCart);
    }
  } catch (err) {
    console.error("Cart load error:", err);
    localStorage.removeItem(cartKey);
  }
}, []);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROFILE ORDERS:", response.data);

      setOrders(response.data);
    } catch (err) {
      console.error("Order fetch error:", err);
    }
  };

  fetchOrders();
}, []);

useEffect(() => {
  const fetchAddresses = async () => {
    try {
      console.log("TOKEN =", localStorage.getItem("token"));
      const token = localStorage.getItem("token");

const res = await axios.get(
  `${API}/api/user/me`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setAddresses(res.data.address || []);
    } catch (err) {
      console.error("Address fetch error:", err);
    }
  };

  fetchAddresses();
}, []);

  return (
    <div className="min-h-screen bg-black text-white pt-36 px-4 md:px-8">

      {/* HERO CARD */}
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-amber-500/20 rounded-3xl p-8 backdrop-blur-lg shadow-[0_0_50px_rgba(245,158,11,0.1)]">

        <div className="flex flex-col md:flex-row md:items-center gap-6">

          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center text-4xl font-bold text-black">
          {user?.email?.charAt(0)?.toUpperCase() || "L"}
          </div>

          <div>
            <h1 className="text-3xl font-light tracking-wider">
            {user?.email?.split("@")[0]}
            </h1>

            <p className="text-zinc-400 mt-2">
              {user?.email}
            </p>

            <p className="text-zinc-500 text-sm mt-1">
              Lolakk  Member
            </p>
          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5 mt-8">

        <div className="bg-zinc-900 border border-amber-500/10 rounded-2xl p-6 text-center">
          <h3 className="text-amber-500 text-sm tracking-widest uppercase">
            Orders
          </h3>
          <p className="text-4xl mt-3 font-light">
            {orders.length}
          </p>
        </div>

        <div className="bg-zinc-900 border border-amber-500/10 rounded-2xl p-6 text-center">
          <h3 className="text-amber-500 text-sm tracking-widest uppercase">
            cart
          </h3>
          <p className="text-4xl mt-3 font-light">
  {cart.length}
</p>
        </div>

        <div className="bg-zinc-900 border border-amber-500/10 rounded-2xl p-6 text-center">
          <h3 className="text-amber-500 text-sm tracking-widest uppercase">
            Status
          </h3>
          <p className="text-lg mt-4 text-green-400">
            Active
          </p>
        </div>

      </div>

      {/* ADDRESS SECTION */}
<div className="max-w-6xl mx-auto mt-12">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-light tracking-[0.2em] text-amber-500">
      YOUR ADDRESSES
    </h2>


    <button
      onClick={() => {
        setEditing(null);
       setForm({
  name: "",
  label: "Home",
  country: "India",
  state: "",
  phone: "",
  pincode: "",
  district: "",
  fullAddress: "",
});
        setShowModal(true);
      }}
      className="px-5 py-2 bg-amber-500 text-black rounded-full"
    >
      + Add Address
    </button>

   
  </div>

  {addresses.length === 0 ? (
    <div className="bg-zinc-900 p-6 rounded-2xl text-zinc-500">
      No addresses added yet.
    </div>
  ) : (
    <div className="grid md:grid-cols-2 gap-4">
      {addresses.map((addr, index) => (
        <div
          key={index}
          className="bg-zinc-900 border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition"
        >
          
<p className="text-amber-300 font-medium">
  {addr.name}
</p>
          <div className="flex justify-between">
            <span className="text-amber-400 font-semibold">
              {addr.label}
            </span>

            {addr.isDefault && (
              <span className="text-green-400 text-xs">
                Default
              </span>
            )}
          </div>

          <p className="text-zinc-400 mt-2">
  {addr.fullAddress}
</p>



<p className="text-sm text-zinc-500 mt-2">
  {addr.district}, {addr.state}
</p>

<p className="text-sm text-zinc-400">
  🌍 {addr.country || "India"}
</p>

<p className="text-sm text-zinc-400 mt-1">
  PIN: {addr.pincode}
</p>

<p className="text-sm text-zinc-400 mt-1">
  📞 {addr.phone}
</p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                setEditing(addr);
                setForm(addr);
                   name: addr.name || "",
                setShowModal(true);
              }}
              className="text-sm text-blue-400"
            >
              Edit
            </button>

            <button
              onClick={async () => {
                await axios.delete(
                  `${API_URL}/api/user/address/${addr._id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                setAddresses(
                  addresses.filter((a) => a._id !== addr._id)
                );
              }}
              className="text-sm text-red-400"
            >
              Delete
            </button>

            <button
              onClick={async () => {
                await axios.put(
                  `${API_URL}/api/user/address/${addr._id}`,
                  { isDefault: true },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                setAddresses(
                  addresses.map((a) => ({
                    ...a,
                    isDefault: a._id === addr._id,
                  }))
                );
              }}
              className="text-sm text-amber-400"
            >
              Set Default
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

      {/* ORDER HISTORY */}
      <div className="max-w-6xl mx-auto mt-12">

        <h2 className="text-2xl font-light tracking-[0.2em] text-amber-500 mb-6">
          ORDER HISTORY
        </h2>

        {orders.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-10 text-center text-zinc-500">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-4">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-zinc-900 border border-white/5 rounded-2xl p-5 hover:border-amber-500/20 transition"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <p className="text-sm text-zinc-500">
                      Order ID
                    </p>

                    <p className="font-mono">
                      #{order._id.slice(-6)}
                    </p>
                  </div>

                  <div>
                    <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm">
                      {order.status}
                    </span>
                  </div>

                </div>

                <div className="mt-4">
  {order.items?.map((item, index) => (
    <div key={index} className="text-sm text-zinc-400">
      {item.name} × {item.quantity}
    </div>
  ))}
</div>

                <div className="mt-4 flex justify-between">

                  <div>
                    <p className="text-zinc-400">
                      Total Amount
                    </p>

                    <p className="text-xl text-amber-500">
                      ₹{order.total}
                    </p>

      
                  </div>

                  <div className="text-right">
                    <p className="text-zinc-400">
                      Date
                    </p>

                    <p>
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="max-w-6xl mx-auto mt-12 mb-16 flex flex-wrap gap-4">

        <button
          onClick={logout}
          className="px-6 py-3 border border-red-500 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition"
        >
          Logout
        </button>

        {showModal && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-zinc-900 p-6 rounded-2xl w-[90%] max-w-md">

      <h2 className="text-xl text-white mb-4">
        {editing ? "Edit Address" : "Add Address"}
      </h2>
 <input
  className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
  placeholder="Full Name"
  value={form.name}
  onChange={(e) =>
    setForm({ ...form, name: e.target.value })
  }
/>
      <input
        className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
        placeholder="Label (Home / Work)"
        value={form.label}
        onChange={(e) =>
          setForm({ ...form, label: e.target.value })
        }
      />

      <input
  type="tel"
  className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
  placeholder="Phone Number"
  value={form.phone}
  onChange={(e) =>
    setForm({ ...form, phone: e.target.value })
  }
/>



<select
  className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
  value={form.country}
  onChange={(e) =>
    setForm({
      ...form,
      country: e.target.value,
      state: "",
      district: "",
    })
  }
>
  <option value="India">🇮🇳 India</option>
  <option value="United States">🇺🇸 United States</option>
  <option value="United Kingdom">🇬🇧 United Kingdom</option>
  <option value="Canada">🇨🇦 Canada</option>
  <option value="Australia">🇦🇺 Australia</option>
  <option value="UAE">🇦🇪 UAE</option>
  <option value="Singapore">🇸🇬 Singapore</option>
  <option value="Malaysia">🇲🇾 Malaysia</option>
  <option value="Germany">🇩🇪 Germany</option>
  <option value="France">🇫🇷 France</option>
  <option value="Other">🌍 Other</option>
</select>

{form.country === "India" ? (
  <select
    className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
    value={form.state}
    onChange={(e) =>
      setForm({
        ...form,
        state: e.target.value,
        district: "",
      })
    }
  >
    <option value="">Select State / Union Territory</option>

    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>

    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
    <option value="Chandigarh">Chandigarh</option>
    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
    <option value="Delhi">Delhi</option>
    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
    <option value="Ladakh">Ladakh</option>
    <option value="Lakshadweep">Lakshadweep</option>
    <option value="Puducherry">Puducherry</option>
  </select>
) : (
  <input
    className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
    placeholder="State / Province / Region"
    value={form.state}
    onChange={(e) =>
      setForm({
        ...form,
        state: e.target.value,
      })
    }
  />
)}

<input
  type="text"
  className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
  placeholder={
    form.country === "India"
      ? "PIN Code"
      : form.country === "United States"
      ? "ZIP Code"
      : form.country === "United Kingdom"
      ? "Postcode"
      : "Postal Code"
  }
  value={form.pincode}
  onChange={(e) =>
    setForm({
      ...form,
      pincode: e.target.value,
    })
  }
/>

{form.country === "India" ? (
  form.state === "Kerala" ? (
    <select
      className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
      value={form.district}
      onChange={(e) =>
        setForm({
          ...form,
          district: e.target.value,
        })
      }
    >
      <option value="">Select District</option>
      <option value="Thiruvananthapuram">Thiruvananthapuram</option>
      <option value="Kollam">Kollam</option>
      <option value="Pathanamthitta">Pathanamthitta</option>
      <option value="Alappuzha">Alappuzha</option>
      <option value="Kottayam">Kottayam</option>
      <option value="Idukki">Idukki</option>
      <option value="Ernakulam">Ernakulam</option>
      <option value="Thrissur">Thrissur</option>
      <option value="Palakkad">Palakkad</option>
      <option value="Malappuram">Malappuram</option>
      <option value="Kozhikode">Kozhikode</option>
      <option value="Wayanad">Wayanad</option>
      <option value="Kannur">Kannur</option>
      <option value="Kasaragod">Kasaragod</option>
    </select>
  ) : (
    <input
      className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
      placeholder="City / District"
      value={form.district}
      onChange={(e) =>
        setForm({
          ...form,
          district: e.target.value,
        })
      }
    />
  )
) : (
  <input
    className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
    placeholder="City"
    value={form.district}
    onChange={(e) =>
      setForm({
        ...form,
        district: e.target.value,
      })
    }
  />
)}

      <textarea
        className="w-full p-3 mb-3 rounded bg-zinc-800 text-white"
        placeholder="Full Address"
        rows={4}
        value={form.fullAddress}
        onChange={(e) =>
          setForm({ ...form, fullAddress: e.target.value })
        }
      />

      <div className="flex gap-2">
        <button
          onClick={() => setShowModal(false)}
          className="flex-1 bg-gray-700 py-2 rounded"
        >
          Cancel
        </button>

       <button
  onClick={async () => {
    if (form.country === "India") {
  if (!/^\d{6}$/.test(form.pincode)) {
    alert("Please enter a valid 6-digit PIN Code");
    return;
  }
} else {
  if (!form.pincode.trim()) {
    alert("Please enter a valid Postal Code");
    return;
  }
}

if (!/^\d{10}$/.test(form.phone)) {
  alert("Please enter a valid 10-digit phone number");
  return;
}

    console.log("TOKEN:", token);
    console.log("FORM:", form);

    try {
      if (editing) {
        await axios.put(
          `${API_URL}/api/user/address/${editing._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/api/user/address`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setShowModal(false);
      const returnPath =
  localStorage.getItem("returnAfterAddress");

if (returnPath) {
  localStorage.removeItem("returnAfterAddress");
  navigate(returnPath);
} else {
  window.location.reload();
}

    } catch (err) {
      console.error("ADDRESS ERROR:", err.response?.data);
      alert(
        JSON.stringify(err.response?.data) ||
        "Failed to save address"
      );
    }
  }}
  className="flex-1 bg-amber-500 text-black py-2 rounded"
>
  Save
</button>
      </div>

    </div>
  </div>
)}

      </div>
    </div>
  );
}
