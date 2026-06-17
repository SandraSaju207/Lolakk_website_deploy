import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Cart() {
  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAddressWarning, setShowAddressWarning] = useState(false);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const cartKey = `lolakk_cart_${userId}`;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAddresses(data.address || []);
      } catch (err) {
        console.error("Address fetch error:", err);
      }
    };

    if (token) fetchAddresses();
  }, []);

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
          isRental: item.isRental || false,
        }));

        setCart(normalizedCart);
      }
    } catch (error) {
      console.error("Cart loading error:", error);
      localStorage.removeItem(cartKey);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, isInitialized]);

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // =========================
  // PAYMENT FIXED
  // =========================
  const proceedToPayment = async (itemsToPay, isSingleItem = false) => {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await res.json();

      const addr =
        user.address?.find((a) => a.isDefault) || user.address?.[0];

      console.log("SELECTED ADDRESS:", addr);

     if (!addr) {
  setShowAddressWarning(true);
  setLoading(false);
  return;
}

     const productTotal = itemsToPay.reduce(
  (acc, item) => acc + item.price * item.qty,
  0
);

const deliveryCharge = 100;

const orderTotal = productTotal + deliveryCharge;

      // CREATE RAZORPAY ORDER
     const orderResponse = await fetch(
  `${API}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  amount: orderTotal,

  customerName: user.name || "Guest User",
  customerEmail: user.email || "",
  customerPhone: addr.phone || "",
}),
        }
      );

     const orderText = await orderResponse.text();

console.log(
  "CREATE ORDER RESPONSE:",
  orderText
);

const orderData = JSON.parse(orderText);

      console.log("ORDER RESPONSE:", orderData);

      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Order failed");
      }

      // OPEN RAZORPAY
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LOLAKK",
        order_id: orderData.id,

        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
  `${API}/api/payments/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
  ...response,

  userId: user._id,

  items: itemsToPay,
  shippingAddress: addr,

  customerName: user.name || "Guest User",
  customerEmail: user.email || "",
  customerPhone: addr.phone || "",

  amount: orderTotal,
   deliveryCharge: 100,
}),
              }
            );

            const verifyText =
  await verifyResponse.text();

console.log(
  "VERIFY PAYMENT RESPONSE:",
  verifyText
);

const verifyData =
  JSON.parse(verifyText);

            if (verifyData.success) {
              alert("Payment Successful");

              setCart([]);
              localStorage.removeItem(cartKey);

              navigate("/");
            } else {
              alert("Payment Failed");
            }
          } catch (err) {
            console.log(err);
            alert("Verification Error");
          }
        },
      };

      console.log(
  "RAZORPAY KEY:",
  import.meta.env.VITE_RAZORPAY_KEY_ID
);

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const deliveryCharge = cart.length > 0 ? 100 : 0;

const grandTotal = cartTotal + deliveryCharge;

  if (!isInitialized) return null;

  return (
    <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto text-white bg-black min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl serif gold-gradient mb-3">
          Your Collection
        </h1>
        <p className="text-gray-400 italic">
          Review your selections for purchase or rental
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-white/10">
          <ShoppingBag size={52} className="mx-auto mb-4 text-gray-500" />
          <p className="text-xl text-gray-500">Your cart is empty</p>

          <button
            onClick={() => navigate("/")}
            className="mt-5 text-amber-500 underline"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 p-6 rounded-2xl glass border border-white/10"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-xl"
                />

                <div className="flex-1">
                  <h2 className="text-xl serif">{item.name}</h2>

                  <p className="text-amber-500 font-bold">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQty(item.id, -1)}>
                      <Minus size={14} />
                    </button>

                    <span>{item.qty}</span>

                    <button onClick={() => updateQty(item.id, 1)}>
                      <Plus size={14} />
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 ml-3"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-gray-400 text-sm">
  Product: ₹{item.price * item.qty}
</p>

<p className="text-gray-400 text-sm">
  Delivery: ₹100
</p>

<p className="text-amber-400 font-bold">
  Total: ₹{item.price * item.qty + 100}
</p>

                  <button
                    disabled={loading}
                    onClick={() => proceedToPayment([item], true)}
                    className="mt-3 bg-amber-600 px-4 py-2 rounded-lg text-black font-bold"
                  >
                    {loading ? "Processing..." : "Checkout"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="glass p-6 rounded-2xl h-fit">
            <h2 className="text-xl mb-4">Order Summary</h2>

            <p>Items: {cart.length}</p>
           <p>Subtotal: ₹{cartTotal}</p>

<p>Delivery Charge: ₹{deliveryCharge}</p>

<hr className="my-3 border-white/10" />

<p className="font-bold text-amber-500 text-lg">
  Total: ₹{grandTotal}
</p>

            {showAddressWarning && (
  <div className="mb-6 p-5 rounded-xl border border-red-500/30 bg-red-500/10 text-center">
    <h2 className="text-red-400 font-bold text-lg mb-2">
      Delivery Address Required
    </h2>

    <p className="text-gray-300 text-sm mb-4">
      Please add a delivery address before proceeding to payment.
    </p>

    <button
      onClick={() => navigate("/profile")}
      className="bg-amber-500 text-black px-5 py-2 rounded-lg font-bold hover:bg-amber-400 transition"
    >
      Add Address
    </button>

    <button
      onClick={() => setShowAddressWarning(false)}
      className="ml-3 text-gray-400 hover:text-white text-sm underline"
    >
      Dismiss
    </button>
  </div>
)}

            <button
              disabled={loading || cart.length === 0}
              onClick={() => proceedToPayment(cart, false)}
              className="w-full mt-4 bg-amber-600 py-3 rounded-xl font-bold"
            >
              {loading ? "Processing..." : "Pay All"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}