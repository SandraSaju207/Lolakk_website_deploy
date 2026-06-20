import { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
import { useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
 const location = useLocation();
const navigate = useNavigate();

const items = location.state?.items || [];
const isSingleItem =
  location.state?.isSingleItem || false;

const totalAmount =
  location.state?.amount || 500;
  

console.log("RAW USER:", localStorage.getItem("user"));

const user =
  JSON.parse(localStorage.getItem("user")) || {};

console.log("PARSED USER:", user);

  const [phone, setPhone] = useState(user.phone || "");
  const [addresses, setAddresses] = useState([]);
const token = localStorage.getItem("token");
const [showFailed, setShowFailed] = useState(false);



useEffect(() => {
  const fetchAddresses = async () => {
    try {
   if (!token) {
  console.log("No token found");
  return;
}

const res = await axios.get(
  `${API}/api/user/me`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

console.log("USER RESPONSE:", res.data);

     setAddresses(
  res.data.address ||
  res.data.addresses ||
  res.data.user?.address ||
  []
);
    } catch (err) {
      console.error(err);
    }
  };

  fetchAddresses();
}, []);

const defaultAddress =
  addresses?.find((a) => a.isDefault === true) ||
  addresses?.[0] ||
  {};

  const goToProfileForAddress = () => {
  localStorage.setItem(
    "returnAfterAddress",
    "/payment"
  );

  navigate("/profile");
};
  // LOAD RAZORPAY SDK
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = src;

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // HANDLE PAYMENT
 const handlePayment = async () => {
  if (loading) return;

  // Check address first
  if (!defaultAddress) {
    alert("Please add delivery address first");
    return;
  }

  if (!phone || phone.trim() === "") {
    alert("Please enter phone number");
    return;
  }

  try {
    setLoading(true);

    console.log("CREATING ORDER...");

      // LOAD SDK
      const sdkLoaded = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!sdkLoaded) {
        alert("Failed to load Razorpay SDK");
        return;
      }

      // CREATE ORDER
      const orderResponse = await fetch(
  `${API}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
           amount: totalAmount,
            total: totalAmount,
            customerName:
  user.name ||
  user.fullName ||
  user.username ||
  "Guest User",

customerEmail: user.email || "",

customerPhone: phone.trim(),
            productName: "Jewellery Booking",
            rentalDuration: "3 Days",
          }),
        }
      );

   const orderData = await orderResponse.json();

console.log("CREATE ORDER RESPONSE:", orderData);

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message || "Failed to create order"
        );
      }

      // OPTIONS
      // CHECK RAZORPAY LOADED
if (!window.Razorpay) {
  alert("Razorpay SDK not loaded. Check index.html script tag.");
  setLoading(false);
  return;
}

const options = {
 key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: orderData.amount,
  currency: orderData.currency,
  name: "LOLAKK",
  order_id: orderData.id,

  handler: async function (response) {
  try {
     console.log("VERIFY REQUEST:", {
      customerName: user.name || "Guest User",
      customerEmail: user.email || "",
      customerPhone: phone,
      amount: totalAmount,
    });

    console.log(
  "RAZORPAY KEY:",
  import.meta.env.VITE_RAZORPAY_KEY_ID
);

    console.log("SENDING TO BACKEND:", {
  userId: user._id,
  customerName: user.name,
  customerEmail: user.email,
});
    const verifyResponse = await fetch(
  `${API}/api/payments/verify-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  ...response,
  items,

  userId: user._id,

  shippingAddress: {
    name: defaultAddress.name || user.name || "Guest",
    label: defaultAddress.label,
    fullAddress: defaultAddress.fullAddress,
    district: defaultAddress.district,
    state: defaultAddress.state,
    pincode: defaultAddress.pincode,
    phone: defaultAddress.phone,
  },

  customerName: user.name,
  customerEmail: user.email,
  customerPhone: phone,
  amount: totalAmount,
})
      }
    );

    const verifyData = await verifyResponse.json();

    if (verifyData.success) {
  const userId = localStorage.getItem("userId");

  localStorage.removeItem(`lolakk_cart_${userId}`);

  setShowSuccess(true);

  setTimeout(() => {
    navigate("/", { replace: true });
  }, 5000);
} else {
      setShowFailed(true);

      setTimeout(() => {
        setShowFailed(false);
      }, 2500);
    }
  } catch (err) {
    console.log(err);

    setShowFailed(true);

    setTimeout(() => {
      setShowFailed(false);
    }, 2500);
  }
},

modal: {
  backdropclose: false,
  escape: false,
  ondismiss: function () {
    setLoading(false);
  },
},
  
};


 if (!window.Razorpay) {
  alert("Razorpay SDK not loaded");
  return;
}


const paymentObject = new window.Razorpay(options);

paymentObject.on("payment.failed", function (response) {
  console.log("PAYMENT FAILED:", response);
  

  setShowFailed(true);

  setTimeout(() => {
    setShowFailed(false);
  }, 2500);
});

paymentObject.open();

    } catch (error) {
      console.log(error);

      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-amber-500/20 p-10 rounded-3xl w-full max-w-md shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-amber-400 mb-4">
          Secure Payment
        </h1>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Complete your LOLAKK jewellery booking securely
          using Razorpay.
        </p>

        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-white">
  ₹{totalAmount}
</h2>
{defaultAddress ? (
  <div className="bg-zinc-800 rounded-2xl p-4 mb-5 text-left border border-amber-500/20">
    <h3 className="text-amber-400 font-semibold mb-2">
      Deliver To
    </h3>

    <p className="text-white">
      {defaultAddress.label}
    </p>

    <p className="text-gray-400 text-sm">
      {defaultAddress.fullAddress}
    </p>

    <p className="text-gray-500 text-xs mt-1">
      {defaultAddress.district},{" "}
      {defaultAddress.state}
    </p>

    <p className="text-gray-500 text-xs">
      PIN: {defaultAddress.pincode}
    </p>

    <button
      onClick={() => navigate("/profile")}
      className="text-amber-400 text-sm mt-3"
    >
      Change Address
    </button>
  </div>
) : (
  <div className="bg-zinc-800 rounded-2xl p-4 mb-5 border border-red-500/20">
    <p className="text-red-400 mb-3">
      No delivery address found
    </p>

    <button
      onClick={goToProfileForAddress}
      className="w-full bg-amber-500 text-black py-2 rounded-xl"
    >
      Add Delivery Address
    </button>
  </div>
)}
        </div>
        <input
  type="tel"
  required
  placeholder="Enter phone number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="w-full p-3 rounded bg-zinc-800 text-white mb-4"
/>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <p className="text-gray-500 text-xs mt-6">
          Secure Razorpay Payment Gateway
        </p>
      </div>

      {showSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="bg-zinc-900 border border-green-500/30 rounded-3xl p-8 w-[90%] max-w-md text-center shadow-2xl animate-in fade-in zoom-in duration-300">
      <CheckCircle
        size={72}
        className="mx-auto text-green-400 mb-4"
      />

      <h2 className="text-3xl font-bold text-white mb-3">
        Payment Successful
      </h2>

      <p className="text-gray-400 mb-6">
        Your jewellery booking has been confirmed.
      </p>

      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-green-500 animate-pulse w-full" />
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Redirecting to home page...
      </p>
    </div>
  </div>
)}

{showFailed && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="bg-zinc-900 border border-red-500/30 rounded-3xl p-8 w-[90%] max-w-md text-center shadow-2xl animate-in fade-in zoom-in duration-300">

      <div className="text-red-400 text-6xl mb-4">✖</div>

      <h2 className="text-3xl font-bold text-white mb-3">
        Payment Failed
      </h2>

      <p className="text-gray-400 mb-6">
        Something went wrong. Please try again.
      </p>

      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-red-500 animate-pulse w-full" />
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Closing automatically...
      </p>
    </div>
  </div>
)}
    </div>
  );
} 